import React from "react";
import { Project } from "../data/fetchProjects";

const ProjectListItem: React.FC<Project> = (props) => {
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
        <div className="is-capitalized has-text-weight-bold">
          {props.project}
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;
