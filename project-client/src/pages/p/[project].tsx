import { useRouter } from "next/router";
import useSwr from "swr";

import TaskCard from "../../components/TaskCard";
import { useAuth } from "../../store/auth";
import { Project } from "../../types";

export default function ProjectPage() {
  const idToken = useAuth((state) => state.idToken);

  const router = useRouter();

  const projectId = router.query.project;

  const { data: project } = useSwr<Project | null>([
    projectId ? `/projects/${projectId}` : null,
    idToken,
  ]);
  return (
    <div className="container flex pt-5">
      {typeof project !== "undefined" && (
        <div className="w-160">
          {project.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
