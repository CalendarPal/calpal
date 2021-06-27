import React from "react";
import { Task } from "../data/fetchTasks";
import TaskListItem from "./TaskListItem";

type TaskListProps = {
  tasks: Task[];
};

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const taskList = tasks.map((task) => (
    <div
      key={task.id}
      className="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
      style={{ cursor: "pointer" }}
    >
      <TaskListItem {...task} />
    </div>
  ));
  return (
    <div className="mt-6">
      <div className="columns is-multiline">{taskList}</div>
    </div>
  );
};

export default TaskList;
