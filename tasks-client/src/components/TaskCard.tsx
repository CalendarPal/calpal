import React from "react";
import { Task } from "../data/fetchTasks";
import { daysSinceCreation, daysUntilCompletion } from "../util";

type TaskCardProps = Task;

const TaskCard: React.FC<TaskCardProps> = (props) => {
  // const days = daysSinceCreation(props.startDate);
  const days = daysUntilCompletion(props.goalDate);

  return (
    <div className="box">
      <div className="content">
        <div style={{ display: "flex" }}>
          <h4 className="mb-0">{props.task}</h4>
          <span className="tag is-link ml-4">
            {days === 1 ? "1 Day" : `${days} Days`}
          </span>
        </div>
        {props.refUrl ? (
          <a href={props.refUrl} target="_blank" rel="noopener noreferrer">
            <p className="help">Reference</p>
          </a>
        ) : undefined}
        <p className="mt-4">{props.description}</p>
      </div>
      <hr style={{ margin: "1em 0" }} />
      <button className="button is-inverted is-primary">Edit</button>
    </div>
  );
};

export default TaskCard;
