import React from "react";
import { Task } from "../data/fetchTasks";
import { daysSinceCreation, daysUntilCompletion } from "../util";

const TaskListItem: React.FC<Task> = (props) => {
  const creationDate = new Date(props.startDate);
  const completionDate = new Date(props.goalDate);
  const daysSinceCreated = daysSinceCreation(props.startDate);
  const daysUntilGoal = daysUntilCompletion(props.goalDate);
  const createdYear = creationDate.getFullYear();
  const createdMonth = creationDate.getMonth() + 1;
  const createdDay = creationDate.getDate();
  const goalYear = completionDate.getFullYear();
  const goalMonth = completionDate.getMonth() + 1;
  const goalDay = completionDate.getDate();

  const refUrl = props.refUrl ? (
    <>
      <div
        onClick={(event) => openRefUrl(event)}
        style={{ textDecoration: "underline" }}
      >
        Reference
      </div>
    </>
  ) : undefined;

  const openRefUrl = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    window.open(props.refUrl);
  };

  return (
    <div
      className="notification is-link"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div className="is-capitalized has-text-weight-bold">{props.task}</div>
        <div className="is-italic">{props.description}</div>
      </div>
      <div style={{ marginTop: 24 }}>
        <div>{refUrl}</div>
        <div className="has-text-weight-semibold">
          Creation Date: {`${createdYear}-${createdMonth}-${createdDay}`}
        </div>
        <div className="has-text-weight-semibold">
          Goal Date: {`${goalYear}-${goalMonth}-${goalDay}`}
        </div>
        <div className="has-text-weight-semibold">
          Days until goal: {daysUntilGoal}
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;
