import { useFormik } from "formik";
import React from "react";
import { queryCache, useMutation } from "react-query";
import updateTask from "../data/updateTask";
import { Task } from "../data/fetchTasks";
import { useAuth } from "../store/auth";

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
  const [mutate, { isLoading }] = useMutation(updateTask, {
    onSuccess: async (data) => {
      console.log(data);
      queryCache.invalidateQueries("tasks");
    },
  });

  const formik = useFormik({
    initialValues: {
      task: initialTask?.task || "",
      description: initialTask?.description || "",
      refUrl: initialTask?.refUrl || "",
      startDate: initialTask?.startDate.substr(0, 10) || "",
    },
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
            {initialTask ? "Modify Task" : "Create Task"}
          </p>
          <button
            onClick={onClose}
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
              </div>
            )}
          </section>
          <footer className="modal-card-foot">
            <button
              type="submit"
              className={`button is-info${isLoading ? " is-loading" : ""}`}
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
