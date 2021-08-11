import { useFormik } from "formik";
import { useState } from "react";
import useSWR from "swr";
import * as Yup from "yup";

import { useAuth } from "../store/auth";
import { Project, Task } from "../types";

type EditItemFormProps = {
  itemType: string;
  initialItem?: Task | Project;
};

const EditItemForm: React.FC<EditItemFormProps> = ({
  itemType,
  initialItem,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { idToken } = useAuth();
  let formik: any;
  let formBody;
  const { data: projectList } = useSWR<Project[]>(["/projects", idToken]);
  if (itemType === "Task") {
    const initialTask: Task | undefined = initialItem as Task | undefined;
    formik = useFormik({
      initialValues: {
        title: initialTask?.title || "",
        description: initialTask?.description || "",
        startDate: initialTask?.startDate.substr(0, 10) || "",
        goalDate: initialTask?.goalDate.substr(0, 10) || "",
        project:
          initialTask?.project.id || projectList ? projectList[0].id : "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("A non-empty title is required"),
        description: Yup.string().required(
          "A non-empty description is required"
        ),
        startDate: Yup.date(),
        goalDate: Yup.date(),
        project: Yup.string(),
      }),
      onSubmit: (values) => {
        // mutateUpdate({ ...values, id: initialTask?.id, idToken });
        // TODO: Update database on submit
        console.log(values);
      },
      enableReinitialize: true,
    });

    formBody = (
      <form
        onSubmit={formik.handleSubmit}
        className="relative items-center flex-auto w-full p-6"
      >
        <div className="max-w-md m-auto">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">Title</span>
              <input
                type="text"
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                placeholder="Title"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-center text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                rows={3}
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-center text-red-500">
                  {formik.errors.description}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">Project</span>
              <select
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                id="project"
                name="project"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.project}
              >
                {projectList?.map((project) => {
                  return <option value={project.id}>{project.title}</option>;
                })}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Start Date</span>
              <input
                type="datetime-local"
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                id="startDate"
                name="startDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="text-center text-red-500">
                  {formik.errors.startDate}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">Goal Date</span>
              <input
                type="datetime-local"
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                id="goalDate"
                name="goalDate"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.goalDate}
              />
              {formik.touched.goalDate && formik.errors.goalDate && (
                <p className="text-center text-red-500">
                  {formik.errors.goalDate}
                </p>
              )}
            </label>
          </div>
          {/*footer*/}
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
            <button
              className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              onClick={() => {
                formik.resetForm();
                setShowModal(false);
              }}
            >
              Close
            </button>
            <button
              className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    );
  } else {
    const initialProject: Project | undefined = initialItem as
      | Project
      | undefined;

    formik = useFormik({
      initialValues: {
        title: initialProject?.title || "",
        description: initialProject?.description || "",
      },
      validationSchema: Yup.object({
        title: Yup.string().required("A non-empty title is required"),
        description: Yup.string().nullable(true),
      }),
      onSubmit: (values) => {
        // mutateUpdate({ ...values, id: initialProject?.id, idToken });
        // TODO: Update database on submit
        console.log(values);
        setShowModal(false);
      },
      enableReinitialize: true,
    });

    formBody = (
      <form
        onSubmit={formik.handleSubmit}
        className="relative items-center flex-auto w-full p-6"
      >
        <div className="max-w-md m-auto">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">Title</span>
              <input
                type="text"
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                placeholder="Title"
                id="title"
                name="title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-center text-red-500">
                  {formik.errors.title}
                </p>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700">Description</span>
              <textarea
                className="block w-full mt-1 bg-gray-100 border-transparent rounded-md focus:border-gray-500 focus:bg-white focus:ring-0"
                rows={3}
                id="description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="has-text-centered has-text-danger">
                  {formik.errors.description}
                </p>
              )}
            </label>
          </div>
        </div>
        {/*footer*/}
        <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
          <button
            className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
          <button
            className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-emerald-500 active:bg-emerald-600 hover:shadow-lg focus:outline-none"
            type="submit"
            disabled={!formik.isValid || !formik.dirty}
          >
            Save Changes
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <button
        className="px-6 py-3 ml-2 mr-4 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-bluegray-600 active:bg-pink-600 hover:shadow-lg focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        {/* {initialItem ? "Edit " : "Create "} {itemType} */}
        <i className="fas fa-upload"></i>
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center outline-none focus:outline-none">
            <div className="relative w-full max-w-6xl mx-auto my-6">
              {/*content*/}
              <div className="relative flex flex-col items-center w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                  <h3 className="text-3xl font-semibold">
                    {initialItem ? "Edit " : "Create "} {itemType}
                  </h3>
                  <button
                    className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                    onClick={() => {
                      formik.resetForm();
                      setShowModal(false);
                    }}
                  >
                    <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                {formBody}
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
};
export default EditItemForm;
