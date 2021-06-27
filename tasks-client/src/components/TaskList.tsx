import React from "react";
import { Task } from "../data/fetchTasks";
import TaskListItem from "./TaskListItem";

type TaskListProps = {
  tasks: Task[];
  onTaskSelected(task: Task): void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskSelected }) => {
  const taskList = tasks.map((task) => (
    <div
      key={task.id}
      onClick={() => onTaskSelected(task)}
      className="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
      style={{ cursor: "pointer" }}
    >
      <TaskListItem {...task} />
    </div>
  ));
  return <>{taskList}</>;
};

export default TaskList;
