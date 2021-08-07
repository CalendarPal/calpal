import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";

import { Task } from "../types";

dayjs.extend(relativeTime);

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div key={task.id} className="flex mb-4 bg-white rounded">
      {/* Task data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/project/${task.projectId}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              {task.project.title}
            </a>
          </Link>
          <p className="text-xs text-gray-500">
            <Link href={task.url}>
              <a className="mx-1 hover:underline">
                {dayjs(task.goalDate).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        {task.description && <p className="my-1 text-sm">{task.description}</p>}
        <div className="flex">
          <Link href={task.url}>
            <a>
              <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span>{task.noteCount || `No notes`}</span>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
