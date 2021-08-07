import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";

import TaskCard from "../components/TaskCard";
import ProtectedRoute from "../HOC/ProtectedRoute";
import { useAuth } from "../store/auth";
import { Task } from "../types";

export default ProtectedRoute(function Home() {
  const idToken = useAuth((state) => state.idToken);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    Axios.get("/tasks", { headers: { Authorization: `Bearer ${idToken}` } })
      .then((res) => setTasks(res.data))
      .catch((err: Error) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="pt-16">
      <Head>
        <title>Calpal: let us worry so you don't have too</title>
      </Head>
      <div className="container flex pr-4">
        {/* Tasks feed */}
        <div className="w-160">
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
});
