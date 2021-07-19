import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import Loader from "../components/ui/Loader";
import TaskCard from "../components/TaskCard";
import { FetchTaskData, fetchTasks } from "../data/fetchTasks";
import { useAuth } from "../store/auth";
import { Project } from "../data/fetchProjects";

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

  const projectList = localStorage.getItem("projectData");

  const projectCards =
    projectList &&
    JSON.parse(projectList).map((project: Project, i: number) => (
      <div className="column">
        <div
          className={`card ${
            [
              "has-background-primary has-text-white",
              "has-background-warning has-text-black",
              "has-background-info has-text-white",
              "has-background-danger has-text-white",
            ][i % 4]
          }`}
        >
          <div className="card-header">
            <div className="card-header-title has-text-white">
              X Active Tasks
            </div>
          </div>
          <div className="card-content">
            <p className="is-size-3">{project.project}</p>
          </div>
        </div>
      </div>
    ));
  return (
    <div className="p-1">
      <div className="columns is-variable is-desktop">
        <div className="column">
          <h1 className="title">Dashboard</h1>
        </div>
      </div>

      <div className="columns is-variable is-desktop">{projectCards}</div>
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

export default Overview;

// TODO: Eventually create a calendar view for tasks instead of just a list
