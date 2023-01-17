import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MultiValue } from "react-select"
import { TaskContext } from "context/TaskContext"
import { Task, PageOffset } from "types/task"
import { BooleanOption, NumberOption } from "types/common"
import { COMPLETED_OPTIONS } from "constants/task"
import { DEFAULT_ITEMS_PER_PAGE } from "constants/pagination"
import Pagination from "components/Pagination"
import MultiSelect from "components/MultiSelect"
import DataTable from "./DataTable"
import TaskForm from "./TaskForm"
import "./style.scss"

const Dashboard = () => {
  const { todoData, deleteTask } = useContext(TaskContext)
  const navigate = useNavigate()

  const [filteredData, setFilteredData] = useState<Task[]>([])
  const [pageOffset, setPageOffset] = useState<PageOffset>({
    start: 0,
    end: DEFAULT_ITEMS_PER_PAGE - 1
  })
  const [isPaginationReset, setIsPagingationReset] = useState<boolean>(false)
  const [userIdOptions, setUserIdOptions] = useState<NumberOption[]>([])
  const [selectedUserIdOptions, setSelectedUserIdOptions] = useState<
    NumberOption[]
  >([])
  const [selectedCompletedOptions, setSelectedCompletedOptions] = useState<
    BooleanOption[]
  >([])
  const [searchTitle, setSearchTitle] = useState<string>("")
  const [selectedData, setSelectedData] = useState<Task | null>(null)
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false)

  const handleDataTablePageChange = (start: number, end: number) => {
    setPageOffset({ start, end })
  }

  const handleChangeUserIdFilter = (
    options: MultiValue<NumberOption | BooleanOption>
  ) => {
    setIsPagingationReset(true) // Reset current page when the user id filter is changed
    setSelectedUserIdOptions([...options] as NumberOption[])
  }

  const handleChangeCompletedFilter = (
    options: MultiValue<NumberOption | BooleanOption>
  ) => {
    setIsPagingationReset(true) // Reset current page when the completed filter is changed
    setSelectedCompletedOptions([...options] as BooleanOption[])
  }

  const handleChangeSearchTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value)
  }

  const handleEditData = (task: Task) => {
    setSelectedData(task)
    setShowTaskForm(true)
  }

  const handleDeleteData = (taskId: number) => {
    try {
      deleteTask(taskId)
    } catch (err) {
      console.log("Error while deleting task")
    }
  }

  const handleShowChartBoard = () => {
    navigate("/dashboard/chart")
  }

  const handleShowTaskForm = () => {
    setShowTaskForm(true)
  }

  const handleCloseTaskForm = () => {
    setShowTaskForm(false)
    setSelectedData(null)
  }

  useEffect(() => {
    const userOptions: NumberOption[] = []
    for (let i = 0; i < todoData.length; i++) {
      if (
        userOptions.findIndex(
          (userOption) => userOption.value === todoData[i].userId
        ) === -1
      ) {
        userOptions.push({
          value: todoData[i].userId,
          label: todoData[i].userId
        })
      }
    }
    setUserIdOptions(userOptions)

    const selectedUserOptions = selectedUserIdOptions.filter(
      (selectedUserIdOption) =>
        userOptions.findIndex(
          (userOption) => userOption.value === selectedUserIdOption.value
        ) !== -1
    )
    setSelectedUserIdOptions(selectedUserOptions)
  }, [todoData])

  useEffect(() => {
    let data = [...todoData]
    if (selectedUserIdOptions.length > 0) {
      data = data.filter(
        (todoItem) =>
          selectedUserIdOptions.findIndex(
            (selectedUserIdOption) =>
              selectedUserIdOption.value === todoItem.userId
          ) !== -1
      )
    }

    if (selectedCompletedOptions.length > 0) {
      data = data.filter(
        (todoItem) =>
          selectedCompletedOptions.findIndex(
            (selectedCompletedOption) =>
              selectedCompletedOption.value === todoItem.completed
          ) !== -1
      )
    }

    if (searchTitle.length > 0) {
      data = data.filter((todoItem) =>
        todoItem.title.toLowerCase().includes(searchTitle.trim().toLowerCase())
      )
    }

    setFilteredData(data)
    setIsPagingationReset(false)
  }, [selectedUserIdOptions, selectedCompletedOptions, searchTitle])

  return (
    <div className="dashboard">
      <div className="filters-container">
        <span className="filter-main-title filter-title">Filter by</span>
        <div className="filters">
          <div className="filter">
            <span className="filter-title">User ID</span>
            <MultiSelect
              options={userIdOptions}
              value={selectedUserIdOptions}
              onChange={handleChangeUserIdFilter}
            />
          </div>
          <div className="filter">
            <span className="filter-title">Completed Status</span>
            <MultiSelect
              options={COMPLETED_OPTIONS}
              value={selectedCompletedOptions}
              onChange={handleChangeCompletedFilter}
            />
          </div>
        </div>
      </div>
      <div className="filters-container">
        <span className="filter-main-title filter-title">Search by</span>
        <div className="filters">
          <div className="filter">
            <span className="filter-title">Title</span>
            <input value={searchTitle} onChange={handleChangeSearchTitle} />
          </div>
        </div>
      </div>
      <div className="add-container">
        <button
          className="btn-action btn-primary"
          onClick={handleShowChartBoard}
        >
          Show on chart
        </button>
        <button className="btn-action btn-primary" onClick={handleShowTaskForm}>
          Add +
        </button>
      </div>
      <DataTable
        data={filteredData.slice(pageOffset.start, pageOffset.end + 1)}
        onEdit={handleEditData}
        onDelete={handleDeleteData}
      />
      <Pagination
        totalCount={filteredData.length}
        isReset={isPaginationReset}
        onChangePage={handleDataTablePageChange}
      />
      {showTaskForm && (
        <TaskForm data={selectedData} onClose={handleCloseTaskForm} />
      )}
    </div>
  )
}

export default Dashboard
