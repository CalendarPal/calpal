import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import EditTaskForm from "../components/EditTaskForm";
import Loader from "../components/ui/Loader";
import TaskList from "../components/TaskList";
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
    isFetchingMore,
  } = useInfiniteQuery<FetchTaskData, Error>(
    ["tasks", { isFibo: false, limit: 4, idToken }],
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
    data.map(
      (group, i) =>
        group.tasks && (
          <TaskList
            key={i}
            tasks={group.tasks}
            onTaskSelected={(task) => {
              setSelectedTask(task);
              setEditIsOpen(true);
            }}
          />
        )
    );

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
      {taskList}
      {isFetchingMore && <Loader color="red" />}
      {canFetchMore && (
        <button
          onClick={() => {
            fetchMore();
          }}
          className="button is-primary mt-6"
        >
          Fetch more!
        </button>
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
