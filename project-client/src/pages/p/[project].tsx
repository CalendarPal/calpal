import { useRouter } from "next/router";
import React from "react";
import useSwr from "swr";

import TaskCard from "../../components/TaskCard";
import { useAuth } from "../../store/auth";
import { Project } from "../../types";

export default function ProjectPage() {
  const idToken = useAuth((state) => state.idToken);

  const router = useRouter();

  const projectId = router.query.project;

  const { data: project, error } = useSwr<Project>([
    `/projects/${projectId}`,
    idToken,
  ]);

  if (error) router.push("/");

  let tasksMarkup;
  if (
    typeof project === "undefined" ||
    typeof project === "string" ||
    !project
  ) {
    tasksMarkup = <p className="text-lg text-center">Loading..</p>;
  } else if (project.tasks.length === 0) {
    tasksMarkup = (
      <p className="text-lg text-center">No tasks have been added yet</p>
    );
  } else {
    tasksMarkup = project.tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ));
  }

  return (
    <div className="container flex pt-5">
      {typeof project !== "undefined" && typeof project !== "string" && (
        <div className="w-160">{tasksMarkup}</div>
      )}
    </div>
  );
}
