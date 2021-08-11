import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";

import { Task } from "../types";

dayjs.extend(relativeTime);

export default function UpcomingTaskItem(props: { task: Task }) {
  const { task } = props;
  return (
    <tr>
      <th className="p-4 px-6 text-xs text-left align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
        <Link href={task.url}>
          <a className="hover:underline">
            {task.project.title} | {task.title}
          </a>
        </Link>
      </th>
      <td className="p-4 px-6 pl-8 text-xs text-left align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
        {task.noteCount}
      </td>
      <td className="p-4 px-6 text-xs text-left align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
        {dayjs(task.goalDate).format("DD/MM/YYYY")}
      </td>
      <td className="p-4 px-6 text-xs text-left align-middle border-t-0 border-l-0 border-r-0 whitespace-nowrap">
        {dayjs(task.goalDate).fromNow()}
      </td>
    </tr>
  );
}
