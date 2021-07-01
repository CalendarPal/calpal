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
    <div
      key={project.id}
      onClick={() => onProjectSelected(project)}
      className="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen"
      style={{ cursor: "pointer" }}
    >
      <ProjectListItem {...project} />
    </div>
  ));
  return <>{projectList}</>;
};

export default ProjectList;
