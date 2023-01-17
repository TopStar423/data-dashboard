export interface Task {
  id: number
  userId: number
  title: string
  completed: boolean
}

export type TaskInput = Omit<Task, "id">

export interface PageOffset {
  start: number
  end: number
}
