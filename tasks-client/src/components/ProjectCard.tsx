import React from "react";
import { Project } from "../data/fetchProjects";

type ProjectCardProps = Project;

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  return (
    <div className="column">
      <div className="card has-background-warning has-text-black">
        <div className="card-header">
          <div className="card-header-title has-text-black is-uppercase">
            1 Active Task
          </div>
        </div>
        <div className="card-content">
          <p className="is-size-3">{props.project}</p>
        </div>
      </div>
    </div>
    // <div className="box">
    //   <div className="content">
    //     <div style={{ display: "flex" }}>
    //       <h4 className="mb-0">{props.project}</h4>
    //       <span className="tag is-link ml-4">
    //         {days === 1 ? "1 Day" : `${days} Days`}
    //       </span>
    //     </div>
    //     {props.refUrl ? (
    //       <a href={props.refUrl} target="_blank" rel="noopener noreferrer">
    //         <p className="help">Reference</p>
    //       </a>
    //     ) : undefined}
    //     <p className="mt-4">{props.description}</p>
    //   </div>
    // </div>
  );
};

export default ProjectCard;
