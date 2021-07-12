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
    // <div className="p-1">
    //   <div className="columns is-variable is-desktop">
    //     <div className="column">
    //       <h1 className="title">Dashboard</h1>
    //     </div>
    //   </div>
    //   {isLoading && <Loader radius={200} />}
    //   {error && <p>{error.message}</p>}
    //   {taskList && (
    //     <InfiniteScroll
    //       pageStart={0}
    //       loadMore={() => fetchMore()}
    //       hasMore={canFetchMore}
    //       loader={<Loader key={0} color="red" />}
    //       children={taskList}
    //     />
    //   )}
    <div className="p-1">
      <div className="columns is-variable is-desktop">
        <div className="column">
          <h1 className="title">Dashboard</h1>
        </div>
      </div>

      <div className="columns is-variable is-desktop">
        {/* <div className="column">
          <div className="card has-background-primary has-text-white">
            <div className="card-header">
              <div className="card-header-title has-text-white">
                3 Active Tasks
              </div>
            </div>
            <div className="card-content">
              <p className="is-size-3">CS2506 - Operating Systems II</p>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card has-background-warning has-text-black">
            <div className="card-header">
              <div className="card-header-title has-text-black is-uppercase">
                1 Active Task
              </div>
            </div>
            <div className="card-content">
              <p className="is-size-3">CS2502 - Logic Design</p>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card has-background-info has-text-white">
            <div className="card-header">
              <div className="card-header-title has-text-white is-uppercase">
                4 Active Tasks
              </div>
            </div>
            <div className="card-content">
              <p className="is-size-3">CS2515 - Algorithms II</p>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card has-background-danger has-text-white">
            <div className="card-header">
              <div className="card-header-title has-text-white">
                No Active Tasks
              </div>
            </div>
            <div className="card-content">
              <p className="is-size-3">CS2514 - Intro to Java</p>
            </div>
          </div>
        </div> */}
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

export default Overview;

// TODO: Eventually create a calendar view for tasks instead of just a list
