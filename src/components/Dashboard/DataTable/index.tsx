import React from "react"
import { Task } from "types/task"
import "./style.scss"

interface DataTablePropsType {
  data: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

const DataTable = ({ data, onEdit, onDelete }: DataTablePropsType) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col" className="td-user-id">
            User ID
          </th>
          <th scope="col" className="td-title">
            Title
          </th>
          <th scope="col" className="td-status">
            Status
          </th>
          <th scope="col" className="td-action"></th>
          <th scope="col" className="td-action"></th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td className="td-user-id">{item.userId}</td>
            <td className="td-title">{item.title}</td>
            <td className="td-status">
              {item.completed ? "Completed" : "Incomplete"}
            </td>
            <td className="td-action">
              <span className="btn" onClick={() => onEdit(item)}>
                &#10000;
              </span>
            </td>
            <td className="td-action">
              <span className="btn" onClick={() => onDelete(item.id)}>
                &#128465;
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable
