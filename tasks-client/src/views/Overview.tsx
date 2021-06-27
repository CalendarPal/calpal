import React from "react";
import { useQuery } from "react-query";
import Loader from "../components/ui/Loader";
import TaskCard from "../components/TaskCard";
import { FetchTaskData, fetchTasks } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

const Overview: React.FC = () => {
  const idToken = useAuth((state) => state.idToken);

  const { isLoading, isError, data, error } = useQuery<FetchTaskData, Error>(
    ["tasks", [1, 12, idToken]],
    (context) =>
      fetchTasks(context.queryKey[0] as string, {
        page: context.queryKey[1][0],
        limit: context.queryKey[1][1],
        idToken: context.queryKey[1][2],
      })
  );

  const taskList =
    data && data.tasks.map((task) => <TaskCard key={task.id} {...task} />);
  return (
    <>
      <h1 className="title is-3">Today's Tasks</h1>
      <div className="buttons is-centered">
        <button className="button is-info">Create Task</button>
      </div>

      {isLoading && <Loader radius={200} />}
      {isError && <p>{error?.message}</p>}
      {taskList}
    </>
  );
};

export default Overview;
