import React from "react";
import { useInfiniteQuery } from "react-query";
import Loader from "../components/ui/Loader";
import TaskCard from "../components/TaskCard";
import { FetchTaskData, fetchTasks } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

const Overview: React.FC = () => {
  const idToken = useAuth((state) => state.idToken);

  const {
    data,
    isLoading,
    error,
    canFetchMore,
    fetchMore,
    isFetchingMore,
  } = useInfiniteQuery<FetchTaskData, Error>(
    ["tasks", { limit: 2, idToken }],
    fetchTasks,
    {
      getFetchMore: (lastGroup, allGroups) => {
        const { page, pages } = lastGroup;

        if (page >= pages) {
          return undefined;
        }

        return page + 1;
      },
    }
  );

  const taskList =
    data &&
    data.map((group, i) => (
      <React.Fragment key={i}>
        {group.tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </React.Fragment>
    ));
  return (
    <>
      <h1 className="title is-3">Today's Tasks</h1>
      <div className="buttons is-centered">
        <button className="button is-info">Create Task</button>
      </div>

      {isLoading && <Loader radius={200} />}
      {error && <p>{error.message}</p>}
      {taskList}
      {isFetchingMore && <Loader color="red" />}
      {canFetchMore && (
        <button
          onClick={() => {
            fetchMore();
          }}
          className="button is-primary"
        >
          Fetch more!
        </button>
      )}
    </>
  );
};

export default Overview;
