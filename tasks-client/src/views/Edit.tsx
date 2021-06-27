import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import EditTaskForm from "../components/EditTaskForm";
import Loader from "../components/ui/Loader";
import TaskList from "../components/TaskList";
import InfiniteScroll from "react-infinite-scroller";
import { FetchTaskData, fetchTasks, Task } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

const Edit: React.FC = () => {
  const [createIsOpen, setCreateIsOpen] = useState(false);
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const idToken = useAuth((state) => state.idToken);

  const {
    data,
    isLoading,
    error,
    isError,
    canFetchMore,
    fetchMore,
  } = useInfiniteQuery<FetchTaskData, Error>(
    ["tasks", { limit: 4, idToken }],
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
        {group.tasks && (
          <TaskList
            key={i}
            tasks={group.tasks}
            onTaskSelected={(task) => {
              setSelectedTask(task);
              setEditIsOpen(true);
            }}
          />
        )}
      </React.Fragment>
    ));

  return (
    <>
      <h1 className="title is-3">Your Task List</h1>
      <div className="buttons is-centered">
        <button
          onClick={() => setCreateIsOpen(true)}
          className="button is-info"
        >
          Create Task
        </button>
      </div>

      {isLoading && <Loader radius={200} />}
      {isError && <p>{error?.message}</p>}
      {isError && <p>{error?.message}</p>}
      {taskList && (
        <InfiniteScroll
          className="columns is-multiline mt-6"
          pageStart={0}
          loadMore={() => fetchMore()}
          hasMore={canFetchMore}
          loader={<Loader key={0} color="red" />}
          children={taskList}
        />
      )}
      <EditTaskForm
        isOpen={createIsOpen}
        onClose={() => {
          setCreateIsOpen(false);
        }}
      />
      <EditTaskForm
        isOpen={editIsOpen}
        initialTask={selectedTask}
        onClose={() => {
          setEditIsOpen(false);
          setSelectedTask(undefined);
        }}
      />
    </>
  );
};

export default Edit;
