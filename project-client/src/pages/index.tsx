import React from "react";
import useSWR from "swr";

import TaskCalendar from "../components/Calendar";
import ProjectCard from "../components/ProjectCard";
import UpcomingTaskTable from "../components/UpcomingTaskTable";
import { useAuth } from "../store/auth";
import { Project, Task } from "../types";

export default function Dashboard() {
  const idToken = useAuth((state) => state.idToken);

  const { data: projects } = useSWR<Project[]>(["/projects", idToken]);
  const { data: tasks } = useSWR<Task[]>(["/tasks", idToken]);
  return (
    <>
      <div className="relative pt-12 pb-24 bg-pink-600 md:pt-24">
        <div className="w-full px-4 mx-auto md:px-10">
          <div>
            {typeof projects !== "undefined" && (
              <div className="flex flex-wrap">
                {projects.map((project: Project) => (
                  <ProjectCard project={project} key={project.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-4 mx-auto -m-24 md:px-10">
        <div className="flex flex-wrap md:mt-12 lg:mt-38">
          <div className="w-full px-4 mb-12 xl:w-full xl:mb-0">
            <div className="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg">
              <div className="px-4 py-3 mb-0 border-0 rounded-t">
                <div className="flex flex-wrap items-center">
                  <div className="relative flex-1 flex-grow w-full max-w-full px-4">
                    <h3 className="text-base font-semibold text-blueGray-700">
                      Upcoming Tasks
                    </h3>
                  </div>
                  <div className="relative flex-1 flex-grow w-full max-w-full px-4 text-right">
                    <button
                      className="px-3 py-1 mb-1 mr-1 text-xs font-bold text-white uppercase bg-indigo-500 rounded outline-none active:bg-indigo-600 focus:outline-none"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                    >
                      See all
                    </button>
                  </div>
                </div>
              </div>
              {/* Upcoming task table */}
              {typeof tasks !== "undefined" && (
                <div className="block w-full overflow-x-auto">
                  <UpcomingTaskTable tasks={tasks} />
                </div>
              )}
            </div>
            <div className="relative flex flex-col w-full min-w-0 p-8 mb-6 break-words bg-white rounded shadow-lg">
              <TaskCalendar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
