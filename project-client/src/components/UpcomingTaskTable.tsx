import React from "react";

import { Task } from "../types";
import UpcomingTaskItem from "./UpcomingTaskItem";

export default function UpcomingTaskTable(props: { tasks: Task[] }) {
  const { tasks } = props;
  return (
    <table className="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
            Task name
          </th>
          <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
            Notes
          </th>
          <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
            Goal Date
          </th>
          <th className="px-6 py-3 text-xs font-semibold text-left uppercase align-middle border border-l-0 border-r-0 border-solid bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap">
            Days until Goal
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Upcoming tasks list */}
        {tasks.map((task: Task) => (
          <UpcomingTaskItem task={task} />
        ))}
      </tbody>
    </table>
  );
}
