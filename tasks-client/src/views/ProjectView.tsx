import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import Loader from "../components/ui/Loader";
import { useLocation } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { FetchTaskData, fetchTasks } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

const ProjectView: React.FC = (props) => {
  const location = useLocation();
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
        {group.tasks.map((task) =>
          location.state &&
          (location.state as any).projectId === task.projectId ? (
            <TaskCard key={task.id} {...task} />
          ) : null
        )}
      </React.Fragment>
    ));

  return (
    <div className="p-1">
      <div className="columns is-variable is-desktop">
        <div className="column">
          <h1 className="title">
            {location.state && (location.state as any).projectName
              ? (location.state as any).projectName + " Overview"
              : "Project Overview"}
          </h1>
        </div>
      </div>

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
    </div>
  );
};

export default ProjectView;
