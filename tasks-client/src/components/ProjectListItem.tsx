import React from "react";
import { Project } from "../data/fetchProjects";
import { NavLink } from "react-router-dom";

const ProjectListItem: React.FC<Project> = (props) => {
  const location = {
    pathname: `/projects`,
    state: {
      projectId: props.id,
      projectName: props.project,
      userId: props.userId,
    },
  };

  return (
    <NavLink
      exact
      to={location}
      isActive={(match, location) => {
        if (!match) {
          return false;
        }

        return (
          location.state &&
          (location.state as any).projectName === props.project
        );
      }}
      activeClassName="is-active"
    >
      {props.project}
    </NavLink>
  );
};

export default ProjectListItem;
