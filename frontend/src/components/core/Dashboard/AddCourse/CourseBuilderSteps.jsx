import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import CourseInformationForm from "./CourseForms/CourseInformationForm";
import CourseBuilderForm from "./CourseBuilderForm/CourseBuilderForm";
import CoursePublishForm from "./CoursePublishForm/CoursePublishForm";

const CourseBuilderSteps = () => {
  const { step } = useSelector((state) => state.course);
  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];
  return (
    <>
      <div className="flex w-full">
        {steps.map((item) => {
          return (
            <div className="flex flex-col w-1/3 gap-3" key={item.id}>
              <div className="flex relative h-8 w-full ml-[100px]">
                <div
                  className={`absolute aspect-square h-8 w-8 rounded-full flex text-center justify-center items-center text-lg ${
                    step === item.id
                      ? "bg-yellow-900 border-yellow-50 border-2 text-yellow-50"
                      : "bg-richblack-800 border-richblack-700 border-2 text-richblack-300"
                  } ${step > item.id ? "bg-yellow-50" : ""}`}
                >
                  {step > item.id ? (
                    <FaCheck className="text-richblack-800 text-sm" />
                  ) : (
                    item.id
                  )}
                </div>
                {item.id !== steps.length && (
                  <div
                    className={`${
                      step > item.id
                        ? "border-yellow-400"
                        : "border-richblack-700"
                    }  border-dashed border-[1px] w-full my-auto`}
                  ></div>
                )}
              </div>
              <h3
                className={`${
                  step >= item.id ? "text-richblack-25" : "text-richblack-500"
                } text-[14px] text-center`}
              >
                {item.title}
              </h3>
            </div>
          );
        })}
      </div>
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <CoursePublishForm />}
    </>
  );
};

export default CourseBuilderSteps;
