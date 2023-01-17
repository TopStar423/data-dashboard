import React, { useState, useEffect, useContext, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  LegendItem,
  TooltipItem
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { MultiValue } from "react-select"
import MultiSelect from "components/MultiSelect"
import { TaskContext } from "context/TaskContext"
import { UserIdLegend } from "types/chart"
import { BooleanOption, NumberOption } from "types/common"
import "./style.scss"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const ChartBoard = () => {
  const { todoData } = useContext(TaskContext)
  const navigate = useNavigate()

  const [userIds, setUserIds] = useState<UserIdLegend[]>([])

  const userIdOptions: NumberOption[] = useMemo(
    () =>
      userIds.map((userId) => ({
        value: userId.value,
        label: userId.value
      })),
    [userIds]
  )
  const [selectedUserIdOptions, setSelectedUserIdOptions] = useState<
    NumberOption[]
  >([])

  const chartData = useMemo(() => {
    const selectedUserIds = userIds.filter((userId) => !userId.hidden)
    return {
      labels: selectedUserIds.map((userId) => userId.value),
      datasets: [
        {
          label: "Tasks Completed",
          data: selectedUserIds.map(
            (userId) =>
              todoData.filter(
                (todoItem) =>
                  todoItem.userId === userId.value && todoItem.completed
              ).length
          ),
          backgroundColor: selectedUserIds.map((userId) => userId.bgColor)
        }
      ]
    }
  }, [userIds])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            generateLabels: () => {
              const result = []

              for (let i = 0; i < userIds.length; i++) {
                result.push({
                  text: userIds[i].value.toString(),
                  fillStyle: userIds[i].bgColor,
                  index: i,
                  hidden: userIds[i].hidden
                })
              }

              return result
            }
          },
          onClick(e: ChartEvent, legendItem: LegendItem) {
            const index = legendItem.index
            if (typeof index !== "number") return
            // toggle boolean in userId hidden
            const updatedUserIds = userIds.map((userId, idx) =>
              idx === index ? { ...userId, hidden: !userId.hidden } : userId
            )

            // update user id multiselect
            if (updatedUserIds[index].hidden) {
              // Operation to keep the order of user ids selected already
              const updatedSelectedUsers: NumberOption[] =
                selectedUserIdOptions.filter(
                  (userIdOption) =>
                    updatedUserIds[index].value !== userIdOption.value
                )
              const selectedUsersToAdd: NumberOption[] = updatedUserIds
                .filter(
                  (userId) =>
                    !userId.hidden &&
                    updatedSelectedUsers.findIndex(
                      (userIdOption) => userIdOption.value === userId.value
                    ) === -1
                )
                .map((userId) => ({ value: userId.value, label: userId.value }))
              setSelectedUserIdOptions([
                ...updatedSelectedUsers,
                ...selectedUsersToAdd
              ])
            } else {
              setSelectedUserIdOptions([
                ...selectedUserIdOptions,
                {
                  label: updatedUserIds[index].value,
                  value: updatedUserIds[index].value
                }
              ])
            }

            setUserIds([...updatedUserIds])
          }
        },
        title: {
          display: true,
          text: "Number of Tasks Completed"
        },
        tooltip: {
          callbacks: {
            footer: (tooltipItems: Array<TooltipItem<"bar">>) => {
              const userId = parseInt(tooltipItems[0].label, 10)
              const titles = todoData
                .filter(
                  (todoItem) => todoItem.userId === userId && todoItem.completed
                )
                .map((todoItem) => todoItem.title)
              return titles.join("\n")
            }
          }
        }
      }
    }),
    [userIds]
  )

  const handleNavigateToDashboard = () => {
    navigate("/dashboard")
  }

  const handleChangeUserSelect = (
    selectOptions: MultiValue<NumberOption | BooleanOption>
  ) => {
    const updatedUserIds = userIds.map((userId) =>
      (selectOptions as NumberOption[]).findIndex(
        (option) => option.value === userId.value
      ) === -1
        ? { ...userId, hidden: true }
        : { ...userId, hidden: false }
    )

    setUserIds(updatedUserIds)
    setSelectedUserIdOptions(selectOptions as NumberOption[])
  }

  useEffect(() => {
    const userOptions: UserIdLegend[] = []
    todoData.forEach((todoItem) => {
      if (
        userOptions.findIndex(
          (userOption) => userOption.value === todoItem.userId
        ) === -1
      ) {
        userOptions.push({
          value: todoItem.userId,
          bgColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // set random color for each user data
          hidden: false
        })
      }
    })
    setUserIds(userOptions)
  }, [todoData])

  return (
    <div className="chart-board">
      <a
        className="btn previous text-primary"
        onClick={handleNavigateToDashboard}
      >
        &#8249; Back to Dashboard
      </a>
      <div className="user-id-filter">
        <span className="filter-label">
          Select User ID or toggle the block with User ID and color
        </span>
        <MultiSelect
          options={userIdOptions}
          value={selectedUserIdOptions}
          onChange={handleChangeUserSelect}
        />
      </div>
      <Bar options={chartOptions} data={chartData} />
    </div>
  )
}

export default ChartBoard
