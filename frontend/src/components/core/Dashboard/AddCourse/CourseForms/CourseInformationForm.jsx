import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BiRightArrowAlt } from "react-icons/bi";
import { HiOutlineCurrencyRupee } from "react-icons/hi2";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsApi";
import { setStep, setCourse } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import ChipInput from "./ChipInput";
import Upload from "../Upload";
import RequirementField from "./RequirementField";
import IconBtn from "../../../../Common/IconBtn";

const CourseInformationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { editCourse, course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const response = await fetchCourseCategories();
      const categories = response;
      console.table();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseDescription", course.courseDescription);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("coursePrice", course.price);
      setValue("courseCategory", course.category);
      setValue("courseTags", course.tag);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnailImage);
    }
    getCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseDescription !== course.courseDescription ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseCategory !== course.category ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseImage !== course.thumbnailImage
    ) {
      return true;
    } else return false;
  };

  //handles next button click
  const onSubmit = async (data) => {
    // saving data if user is editing a existing course
    if (editCourse) {
      let toastId = toast.loading("Saving your changes...");
      if (isFormUpdated) {
        const currentValues = getValues();
        const formData = new FormData();
        try {
          formData.append("courseId", course._id);
          if (currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle);
          }
          if (currentValues.courseDescription !== course.courseDescription) {
            formData.append("courseDescription", data.courseDescription);
          }
          if (currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits);
          }
          if (currentValues.coursePrice !== course.price) {
            formData.append("price", data.coursePrice);
          }
          if (currentValues.courseCategory._id !== course.category._id) {
            formData.append("category", data.courseCategory);
          }
          if (
            currentValues.courseRequirements.toString() !==
            course.instructions.toString()
          ) {
            formData.append(
              "instructions",
              JSON.stringify(data.courseRequirements)
            );
          }
          if (currentValues.courseTags.toString() !== course.tags.toString()) {
            formData.append("tag", data.courseTags);
          }
          if (currentValues.courseImage !== course.thumbnailImage) {
            formData.append("thumbnailImage", data.courseImage);
          }
        } catch (error) {
          console.log("error while appending form data ---", error);
        }

        setLoading(true);
        try {
          console.log("Printing formData---", formData);
          const response = await editCourseDetails(token, formData);
          if (response) {
            dispatch(setStep(2));
            dispatch(setCourse(response));
          }
        } catch (error) {
          console.log("Error while calling API" + error);
        }

        setLoading(false);
      } else {
        toast.error("No changes made.");
      }
      toast.dismiss(toastId);
      return;
    }
    // creating a new course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseDescription);
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("price", data.coursePrice);
    formData.append("category", data.courseCategory);
    formData.append("instructions", data.courseRequirements);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("tag", data.courseTags);
    formData.append("thumbnailImage", data.courseImage);

    setLoading(true);
    try {
      console.log("logging formData------", formData);
      const response = await addCourseDetails(token, formData);
      if (response) {
        dispatch(setStep(2));
        dispatch(setCourse(response));
      }
    } catch (error) {
      console.log(
        "Error while calling addCourseDetails API from client",
        error
      );
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        "Loading"
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-md text-richblack-5 border-richblack-700 bg-richblack-800 p-6 space-y-8 text-sm"
        >
          {/*//*course title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="courseTitle" className="text-richblack-100">
              Course Title <sup className="text-pink-300">*</sup>
            </label>
            <input
              id="courseTitle"
              placeholder="Enter a Course Title"
              type="text"
              className="w-full rounded-sm py-2 px-4 bg-richblack-700 "
              {...register("courseTitle", { required: true })}
            />
            {errors.courseTitle && (
              <span className="-mt-1 text-xs text-yellow-100">
                Please Enter Course Title.
              </span>
            )}
          </div>
          {/*//*course description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="courseDescription" className="text-richblack-100">
              Course Description <sup className="text-pink-300">*</sup>
            </label>
            <textarea
              id="courseDescription"
              placeholder="Write a short description about the course."
              rows="6"
              cols="40"
              className="w-full rounded-sm py-2 px-4 bg-richblack-700 "
              {...register("courseDescription", { required: true })}
            />
            {errors.courseDescription && (
              <span className="-mt-1 text-yellow-100 text-xs">
                Please Enter Course Description.
              </span>
            )}
          </div>
          {/*//*course price */}
          <div className="relative flex flex-col gap-2 text-sm">
            <label htmlFor="coursePrice" className="text-richblack-100">
              Course Price <sup className="text-pink-300">*</sup>
            </label>
            <input
              id="coursePrice"
              placeholder="Enter Course Price"
              type="number"
              className="w-full rounded-sm py-2 pl-9 bg-richblack-700 appearance-none"
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
              })}
            />
            <HiOutlineCurrencyRupee className="absolute top-1/2 text-base pl-1 h-7 w-7 text-richblack-200" />
            {errors.coursePrice && (
              <span className="-mt-1 text-xs text-yellow-100 ">
                Please enter Price of the course.
              </span>
            )}
          </div>

          {/*//*course category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="courseCategory" className="text-richblack-100">
              Course Category <sup className="text-pink-300">*</sup>
            </label>
            <select
              id="courseCategory"
              defaultValue={""}
              className="w-full rounded-sm py-2 px-4 bg-richblack-700 "
              {...register("courseCategory", { required: true })}
            >
              <option value="" disabled>
                Choose an option
              </option>
              {!loading &&
                courseCategories.map((category, index) => {
                  return (
                    <option key={index} value={category?._id}>
                      {category?.name}
                    </option>
                  );
                })}
            </select>
            {errors.courseCategory && (
              <span className="-mt-1 text-yellow-100 text-xs">
                Please Enter Course Category.
              </span>
            )}
          </div>
          {/*//*course tags */}
          <ChipInput
            label="Tags"
            name="courseTags"
            placeholder="Enter Tags and press enter"
            register={register}
            errors={errors}
            control={control}
            Controller={Controller}
            setValue={setValue}
            getValues={getValues}
          />
          {/*//*course thumbnailImage */}
          <Upload
            label="Course Image"
            name="courseImage"
            register={register}
            errors={errors}
            setValue={setValue}
            editData={editCourse ? course.thumbnailImage : null}
          />
          {/*//*course benefits */}
          <div className="flex flex-col gap-2">
            <label htmlFor="courseBenefits" className="text-richblack-100">
              Benefits of the course <sup className="text-pink-300">*</sup>
            </label>
            <textarea
              id="courseBenefits"
              placeholder="Please Enter Course Title"
              rows={10}
              className="w-full rounded-sm py-2 px-4 bg-richblack-700 "
              {...register("courseBenefits", { required: true })}
            ></textarea>
            {errors.courseBenefits && (
              <span className="-mt-1 text-yellow-100 text-xs">
                Please Enter Course Category.
              </span>
            )}
          </div>

          {/*//*course requirements */}
          <RequirementField
            name="courseRequirements"
            label="Requirements/Instructions"
            placeholder="Enter Instruction / Requirements for the Course"
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
          />
          <div>
            {editCourse && (
              <button
                onClick={() => dispatch(setStep(2))}
                className="text-center w-fit px-3 py-2 text-richblack-800 bg-richblack-600"
              >
                Continue Without Saving
              </button>
            )}
            <IconBtn
              text={!editCourse ? "Next" : "Save Changes"}
              type="submit"
              customClasses="flex gap-2 items-center px-4 py-3 rounded-md font-semibold text-sm text-richblack-800 bg-yellow-100"
            >
              <BiRightArrowAlt className="text-base" />
            </IconBtn>
          </div>
        </form>
      )}
    </div>
  );
};

export default CourseInformationForm;
