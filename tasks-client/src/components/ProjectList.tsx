import React from "react";
import { Project } from "../data/fetchProjects";
import ProjectListItem from "./ProjectListItem";

type ProjectListProps = {
  projects: Project[];
  onProjectSelected(project: Project): void;
};

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectSelected,
}) => {
  const projectList = projects.map((project) => (
    <li
      key={project.id}
      onClick={() => onProjectSelected(project)}
      className="is-link"
      style={{ cursor: "pointer" }}
    >
      <ProjectListItem {...project} />
    </li>
  ));
  return <>{projectList}</>;
};

export default ProjectList;
