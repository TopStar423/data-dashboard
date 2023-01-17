import React, { useState, useEffect, useContext } from "react"
import Select, { SingleValue } from "react-select"
import { TaskContext } from "context/TaskContext"
import { Task } from "types/task"
import { BooleanOption } from "types/common"
import { COMPLETED_OPTIONS } from "constants/task"
import "./style.scss"

interface TaskFormPropsType {
  data: Task | null
  onClose: () => void
}

// if data is null TaskForm is create form, otherwise it is update form
const TaskForm = ({ data, onClose }: TaskFormPropsType) => {
  const { createTask, updateTask } = useContext(TaskContext)
  const [title, setTitle] = useState<string>("")
  const [userId, setUserId] = useState<number | undefined>(undefined)
  const [completed, setCompleted] = useState<boolean>(false)
  const [errMsg, setErrMsg] = useState<string>("")

  const handleChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(parseInt(e.target.value, 10))
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleChangeCompleted = (
    selectedOption: SingleValue<BooleanOption>
  ) => {
    if (selectedOption !== null) {
      setCompleted(selectedOption?.value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (userId === undefined) {
      setErrMsg("User Id is required")
      return
    } else if (title.trim().length === 0) {
      setErrMsg("Title is required")
      return
    }

    setErrMsg("")

    try {
      if (data !== null) {
        updateTask({
          ...data,
          userId,
          title: title.trim(),
          completed
        })
      } else {
        await createTask({ userId, title: title.trim(), completed })
      }
      onClose()
    } catch (err) {
      setErrMsg("Error while creating a new task. Please try again.")
    }
  }

  useEffect(() => {
    // set initial values if the form is on edit mode
    if (data !== null) {
      setUserId(data.userId)
      setTitle(data.title)
      setCompleted(data.completed)
    }
  }, [data])

  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit}>
        <h1 className="form-title">
          {data === null ? "Create a new task" : "Update task"}
        </h1>
        <div className="input-container">
          <span className="task-form-label">User ID</span>
          <input
            className="task-form-input"
            type="number"
            placeholder="User Id"
            min={1}
            value={userId ?? ""}
            onChange={handleChangeUserId}
          />
        </div>
        <div className="input-container">
          <span className="task-form-label">Title</span>
          <input
            className="task-form-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleChangeTitle}
          />
        </div>
        <div className="input-container">
          <span className="task-form-label">Status</span>
          <Select
            className="task-form-input"
            defaultValue={COMPLETED_OPTIONS[1]}
            options={COMPLETED_OPTIONS}
            onChange={handleChangeCompleted}
          />
        </div>
        <span className="err-msg">{errMsg}</span>
        <button className="btn-close" onClick={onClose} />
        <button type="submit" className="btn-primary btn-submit">
          {data === null ? "Create" : "Update"}
        </button>
      </form>
    </div>
  )
}

export default TaskForm
