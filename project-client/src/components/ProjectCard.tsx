import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import React from "react";

import { Project } from "../types";

dayjs.extend(relativeTime);
interface ProjectCardProps {
  project: Project;
}
export default function ProjectCard(props: ProjectCardProps) {
  const { project } = props;
  // console.log(project);
  return (
    <div className="w-full px-4 lg:w-6/12 xl:w-3/12">
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white rounded shadow-lg xl:mb-0">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative flex-1 flex-grow w-full max-w-full pr-4">
              <h5 className="text-xs font-bold uppercase text-blueGray-400">
                {project.taskCount || 0} Tasks
              </h5>
              <Link href={`/p/${project.id}`}>
                <a className="text-xl font-semibold text-blueGray-700 hover:underline">
                  {project.title}
                </a>
              </Link>
            </div>
            <div className="relative flex-initial w-auto pl-4">
              <div className="inline-flex items-center justify-center w-12 h-12 p-3 text-center text-white bg-red-500 rounded-full shadow-lg">
                <i className="far fa-chart-bar"></i>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-blueGray-400">
            <span className="mr-2 text-emerald-500">
              <i className="pr-2 fas fa-user-edit"></i>
              Updated: {dayjs(project.updatedAt).fromNow()}
            </span>
            {/* <span className="whitespace-nowrap">Since last month</span> */}
          </p>
        </div>
      </div>
    </div>
  );
}
