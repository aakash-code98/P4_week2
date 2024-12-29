import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateSubSection,
  createSubSection,
} from "../../../../../services/operations/courseDetailsApi";
import Upload from "../Upload";
import { setCourse } from "../../../../../slices/courseSlice";
import { RxCross1 } from "react-icons/rx";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDescription", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDescription !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const currentValues = getValues();
    const formData = new FormData();
    if (view) return;
    if (edit) {
      if (!isFormUpdated) {
        toast.error("No changes made to the form");
      } else {
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currentValues.lectureTitle !== modalData.title) {
          formData.append("title", currentValues.lectureTitle);
        }
        if (currentValues.lectureDescription !== modalData.description) {
          formData.append("description", currentValues.lectureDescription);
        }
        if (currentValues.lectureVideo !== modalData.videoUrl) {
          formData.append("videoUrl", currentValues.lectureVideo);
        }

        setLoading(true);
        const result = await updateSubSection(formData, token);
        if (result) {
          if (result) {
            const updatedCourseContent = course.courseContent.map((section) =>
              section._id === modalData.sectionId ? result : section
            );
            const updatedCourse = {
              ...course,
              courseContent: updatedCourseContent,
            };
            dispatch(setCourse(updatedCourse));
          }
          //update course slice with correct course data
          dispatch(setCourse(result));
        }
        setModalData(null);
        setLoading(false);
      }
      return;
    }
    //if add
    if (add) {
      formData.append("sectionId", modalData);
      formData.append("title", data.lectureTitle);
      formData.append("description", data.lectureDescription);
      formData.append("video", data.lectureVideo);

      setLoading(true);
      const result = await createSubSection(formData, token);
      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        );
        const updatedCourse = {
          ...course,
          courseContent: updatedCourseContent,
        };
        dispatch(setCourse(updatedCourse));
      }
      setModalData(null);
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white text-richblack-5 bg-opacity-15 backdrop-blur-sm ">
      <div className="w-5/12  rounded-xl  bg-richblue-900">
        <div className="flex justify-between bg-richblue-700 py-3 px-4 rounded-t-lg">
          <p className="text-xl ">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross1 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <div className="py-3 px-4 mt-2">
          <form
            className="flex flex-col h-full gap-5 text-sm"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Upload
              name="lectureVideo"
              label="Lecture Video"
              register={register}
              setValue={setValue}
              errors={errors}
              video={true}
              viewData={view ? modalData.videoUrl : null}
              editData={edit ? modalData.videoUrl : null}
            />
            <div className="flex flex-col gap-2 ">
              <label htmlFor="lectureTitle">
                Lecture Title {!view && <sup className="text-pink-300">*</sup>}
              </label>
              <input
                type="text"
                id="lectureTitle"
                placeholder="Enter Lecture Title"
                className="w-full rounded-md p-2 bg-richblack-700 text-richblack-5"
                {...register("lectureTitle", { required: true })}
              />
              {errors.lectureTitle && (
                <span className="-mt-1 text-pink-300 text-xs ">
                  Lecture Title is required
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 ">
              <label htmlFor="lectureDescription">
                Lecture Description{" "}
                {!view && <sup className="text-pink-200">*</sup>}
              </label>
              <textarea
                disabled={view || loading}
                name="lectureDescription"
                row="10"
                id="lectureDescription"
                placeholder="Enter Lecture Description"
                className="w-full p-2 h-[180px] rounded-md bg-richblack-700 text-richblack-5"
                {...register("lectureDescription", { required: true })}
              />
              {errors.lectureDescription && (
                <span className="-mt-1 text-pink-300 text-xs ">
                  Lecture Description is required
                </span>
              )}
            </div>
            {!view && (
              <button
                type="submit"
                className=" w-fit py-2 px-4 ml-auto font-medium text-base bg-yellow-50 text-richblack-800 rounded-md"
                disabled={loading}
              >
                {loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubSectionModal;
