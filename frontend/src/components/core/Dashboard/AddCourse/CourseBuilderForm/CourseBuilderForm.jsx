import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStep,
  setEditCourse,
  setCourse,
} from "../../../../../slices/courseSlice";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../Common/IconBtn";
import { MdAddCircleOutline } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";
import toast from "react-hot-toast";
import NestedView from "./NestedView";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsApi";
const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [editSectionName, setEditSectionName] = useState(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    let result;
    let data = getValues();
    setLoading(true);
    if (editSectionName) {
      result = await updateSection(
        {
          updatedName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }
    //update values
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };
/**
 * Cancels the current edit operation by resetting the edit section name
 * to null and clearing the section name input field.
 */
  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };
  const goToNext = () => {
    const hasEmptySection = course.courseContent?.some(
      (section) => section.subSection.length === 0
    );
    if (!course.courseContent?.length || hasEmptySection) {
      toast.error(
        hasEmptySection
          ? "Please add at least one Lecture in each Section"
          : "Please add at least one Section"
      );
      return;
    }
    dispatch(setStep(3));
  };
  const goToBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };
  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="sectionName" className="text-sm text-richblack-5">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add Section Name"
            className="form-style w-full"
            {...register("sectionName", { required: true })}
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required.
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="Submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline="true"
            customClasses={
              "flex gap-2 items-center text-white px-3 py-2 bg-richblack-900 rounded-md border-[1px] border-yellow-50"
            }
          >
            <MdAddCircleOutline className="text-yellow-50" size={20} />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline rounded-md border-[1px] border-richblack-300 p-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goToBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>{" "}
        <IconBtn text="Next" disabled={loading} onClick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
