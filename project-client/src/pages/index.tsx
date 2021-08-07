import Head from "next/head";
import { Fragment } from "react";
import useSWR from "swr";

import TaskCard from "../components/TaskCard";
import { useAuth } from "../store/auth";
import { Task } from "../types";

export default function Home() {
  const idToken = useAuth((state) => state.idToken);

  const { data: tasks } = useSWR<Task[]>(["/tasks", idToken]);

  return (
    <Fragment>
      <Head>
        <title>Calpal: let us worry so you don't have too</title>
      </Head>
      <div className="container flex pt-4">
        {/* Tasks feed */}
        {typeof tasks !== "undefined" && (
          <div className="w-160">
            {tasks.map((task: Task) => (
              <TaskCard task={task} key={task.id} />
            ))}
          </div>
        )}
        {/* Sidebar */}
      </div>
    </Fragment>
  );
}
