import React, { useState, createContext } from "react"
import { Task, TaskInput } from "types/task"

const API_HOST = process.env.REACT_APP_API_HOST as string

export interface TaskContextType {
  todoData: Task[]
  fetchTasks: () => void
  createTask: ({ userId, title, completed }: TaskInput) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: number) => void
}

export interface ProviderPropsType {
  children: React.ReactNode
}

export const TaskContext = createContext<TaskContextType>({
  todoData: [],
  fetchTasks: () => {},
  createTask: () => {},
  updateTask: () => {},
  deleteTask: () => {}
})

export const TaskProvider = ({ children }: ProviderPropsType) => {
  const [todoData, setTodoData] = useState<Task[]>([])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_HOST}/todos`)
      const data = await res.json()
      setTodoData(data as Task[])
    } catch (err) {
      console.log("Error while fetching data: ", err)
    }
  }

  const createTask = async ({ userId, title, completed }: TaskInput) => {
    try {
      const res = await fetch(`${API_HOST}/todos`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          title,
          completed
        })
      })
      const taskId = await res.json()
      setTodoData([
        ...todoData,
        {
          id: taskId as number,
          userId,
          title,
          completed
        }
      ])
    } catch (err) {
      console.log("Error while creating data: ", err)
    }
  }

  const updateTask = async (task: Task) => {
    try {
      await fetch(`${API_HOST}/todos`, {
        method: "PUT",
        body: JSON.stringify(task)
      })
      const data: Task[] = todoData.map((todoItem) =>
        todoItem.id === task.id ? task : todoItem
      )
      setTodoData(data)
    } catch (err) {
      console.log("Error while creating data: ", err)
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await fetch(`${API_HOST}/todos/${taskId}`, {
        method: "DELETE"
      })
      const data: Task[] = todoData.filter((todoItem) => todoItem.id !== taskId)
      setTodoData(data)
    } catch (err) {
      console.log("Error while creating data: ", err)
    }
  }

  return (
    <TaskContext.Provider
      value={{ todoData, fetchTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  )
}
