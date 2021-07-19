import { useFormik, Field } from "formik";
import { useInfiniteQuery } from "react-query";
import React, { useState } from "react";
import { useMutation, useQueryCache } from "react-query";
import updateProject from "../data/updateProject";
import { Project } from "../data/fetchProjects";
import { useAuth } from "../store/auth";
import * as Yup from "yup";
import deleteProject from "../data/deleteProject";
import {
  FetchProjectData,
  fetchProjects,
  // Project,
} from "../data/fetchProjects";
// import CustomSelect from "./CustomSelect";

type EditProjectFormProps = {
  isOpen: boolean;
  initialProject?: Project;
  onClose(): void;
};

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  isOpen,
  initialProject,
  onClose,
}) => {
  const { idToken } = useAuth();
  const queryCache = useQueryCache();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const { data, isLoading, error, canFetchMore, fetchMore } = useInfiniteQuery<
    FetchProjectData,
    Error
  >(["projects", { limit: 99, idToken }], fetchProjects, {
    getFetchMore: (lastGroup, allGroups) => {
      const { page, pages } = lastGroup;

      if (page >= pages) {
        return undefined;
      }

      return page + 1;
    },
  });

  const [mutateUpdate, { isLoading: isUpdating }] = useMutation(updateProject, {
    onSuccess: async () => {
      setErrorMessage(undefined);
      queryCache.invalidateQueries("projects");
      onClose();
    },
    onError: async (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const [mutateDelete, { isLoading: isDeleting }] = useMutation(deleteProject, {
    onSuccess: async () => {
      setErrorMessage(undefined);
      queryCache.invalidateQueries("projects");
      onClose();
    },
    onError: async (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      project: initialProject?.project || "",
    },
    validationSchema: Yup.object({
      project: Yup.string().required("A non-empty project is required"),
    }),
    onSubmit: (values) => {
      mutateUpdate({ ...values, id: initialProject?.id, idToken });
    },
    enableReinitialize: true,
  });
  const projectList =
    data &&
    data.map(
      (group, i) =>
        group.projects &&
        group.projects.map((project) => ({
          label: project.project,
          value: project.id,
        }))
    );
  return (
    <div className={`modal${isOpen ? " is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {initialProject ? "Update Project" : "Create Project"}
          </p>
          <button
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            className="delete"
            aria-label="close"
          ></button>
        </header>
        <form onSubmit={formik.handleSubmit}>
          <section className="modal-card-body">
            <div className="field">
              <label htmlFor="project" className="label">
                Project
              </label>
              <div className="control">
                <input
                  id="project"
                  name="project"
                  className="input is-rounded"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.project}
                />
              </div>
              {formik.touched.project && formik.errors.project && (
                <p className="has-text-centered has-text-danger">
                  {formik.errors.project}
                </p>
              )}
            </div>
          </section>
          <footer
            className="modal-card-foot"
            style={{ justifyContent: "space-between" }}
          >
            {initialProject && (
              <button
                onClick={() => mutateDelete({ id: initialProject.id, idToken })}
                type="button"
                className={`button is-danger${isDeleting ? " is-loading" : ""}`}
              >
                Delete?
              </button>
            )}
            <button
              type="submit"
              className={`button is-info${isUpdating ? " is-loading" : ""}`}
              disabled={!formik.isValid || !formik.dirty}
            >
              Save changes
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EditProjectForm;
