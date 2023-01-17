import React, { useEffect, useContext } from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import { TaskContext } from "context/TaskContext"
import Dashboard from "./dashboard"
import ChartBoard from "./Chart"

const DashboardContainer = () => {
  const { fetchTasks } = useContext(TaskContext)

  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: "/dashboard/chart",
      element: <ChartBoard />
    },
    {
      path: "*",
      element: <Navigate to="/dashboard" replace />
    }
  ])

  useEffect(() => {
    // fetch task in the container so that we can get the data in any dashboard related pages without refetching
    fetchTasks()
  }, [])

  return <RouterProvider router={router} />
}

export default DashboardContainer
