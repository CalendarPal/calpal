import { useFormik } from "formik";
import React, { useState } from "react";
import { useMutation, useQueryCache } from "react-query";
import updateTask from "../data/updateTask";
import { Task } from "../data/fetchTasks";
import { useAuth } from "../store/auth";
import * as Yup from "yup";

type EditTaskFormProps = {
  isOpen: boolean;
  initialTask?: Task;
  onClose(): void;
};

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  isOpen,
  initialTask,
  onClose,
}) => {
  const { idToken } = useAuth();
  const queryCache = useQueryCache();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [mutate, { isLoading }] = useMutation(updateTask, {
    onSuccess: async () => {
      setErrorMessage(undefined);
      queryCache.invalidateQueries("tasks");
      onClose();
    },
    onError: async (error: Error) => {
      setErrorMessage(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      task: initialTask?.task || "",
      description: initialTask?.description || "",
      refUrl: initialTask?.refUrl || "",
      startDate: initialTask?.startDate.substr(0, 10) || "",
    },
    validationSchema: Yup.object({
      task: Yup.string().required("A non-empty task is required"),
      description: Yup.string().required("A non-empty description is required"),
      refUrl: Yup.string().url("Must be a valid URL or empty"),
      startDate: Yup.date(),
    }),
    onSubmit: (values) => {
      mutate({ ...values, id: initialTask?.id, idToken });
    },
    enableReinitialize: true,
  });
  return (
    <div className={`modal${isOpen ? " is-active" : ""}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            {initialTask ? "Update Task" : "Create Task"}
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
              <label htmlFor="task" className="label">
                Task
              </label>
              <div className="control">
                <input
                  id="task"
                  name="task"
                  className="input is-rounded"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.task}
                />
              </div>
              {formik.touched.task && formik.errors.task && (
                <p className="has-text-centered has-text-danger">
                  {formik.errors.task}
                </p>
              )}
            </div>
            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea
                  id="description"
                  name="description"
                  className="textarea"
                  rows={4}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                />
              </div>
              {formik.touched.description && formik.errors.description && (
                <p className="has-text-centered has-text-danger">
                  {formik.errors.description}
                </p>
              )}
            </div>
            <div className="field">
              <label className="label">Reference URL</label>
              <div className="control">
                <input
                  id="refUrl"
                  name="refUrl"
                  className="input is-rounded"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.refUrl}
                />
              </div>
              {formik.touched.refUrl && formik.errors.refUrl && (
                <p className="has-text-centered has-text-danger">
                  {formik.errors.refUrl}
                </p>
              )}
            </div>
            {initialTask && (
              <div className="field">
                <label className="label">Change Start Date</label>
                <div className="control">
                  <input
                    id="startDate"
                    name="startDate"
                    className="input is-rounded"
                    type="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startDate}
                  />
                </div>
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="has-text-centered has-text-danger">
                    {formik.errors.startDate}
                  </p>
                )}
              </div>
            )}
            {errorMessage && (
              <p className="has-text-danger has-text-centered is-5">
                {errorMessage}
              </p>
            )}
          </section>
          <footer className="modal-card-foot">
            <button
              type="submit"
              className={`button is-info${isLoading ? " is-loading" : ""}`}
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

export default EditTaskForm;
