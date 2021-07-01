import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import Loader from "../components/ui/Loader";
import TaskCard from "../components/TaskCard";
import { FetchTaskData, fetchTasks } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

const Overview: React.FC = () => {
  const idToken = useAuth((state) => state.idToken);

  const { data, isLoading, error, canFetchMore, fetchMore } = useInfiniteQuery<
    FetchTaskData,
    Error
  >(["tasks", { limit: 4, idToken }], fetchTasks, {
    getFetchMore: (lastGroup, allGroups) => {
      const { page, pages } = lastGroup;

      if (page >= pages) {
        return undefined;
      }

      return page + 1;
    },
  });

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
      <h1 className="title is-3">Current Tasks</h1>

      {isLoading && <Loader radius={200} />}
      {error && <p>{error.message}</p>}
      {taskList && (
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetchMore()}
          hasMore={canFetchMore}
          loader={<Loader key={0} color="red" />}
          children={taskList}
        />
      )}
    </>
  );
};

export default Overview;

// TODO: Eventually create a calendar view for tasks instead of just a list
