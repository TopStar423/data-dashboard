import React from "react"
import { TaskProvider } from "context/TaskContext"
import DashboardContainer from "components/Dashboard"
import "./App.css"

function App() {
  return (
    <TaskProvider>
      <DashboardContainer />
    </TaskProvider>
  )
}

export default App
