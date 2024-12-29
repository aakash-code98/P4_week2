import React from "react";
import { FaArrowRight } from "react-icons/fa";
import InstructorImg from "../../../assets/Images/Instructor.png";
import CTAButton from "../../Common/Button";
import HighlightText from "../../Common/HighlightText";
const InstructorSection = () => {
  return (
    <div className="flex flex-row gap-20 items-center mb-20">
      <div className="w-[50%]">
        <img src={InstructorImg} alt="An Instructor" />
      </div>
      <div className="w-[50%] flex flex-col gap-10">
        <div className="text-4xl font-semibold">
          Become an <HighlightText text="Instructor" />
        </div>
        <p className="font-medium text-[16px] w-[70%] text-richblack-300">
          Instructors from around the world teach millions of students on
          StudyNotion. We provide the tools and skills to teach what you love.
        </p>
        <div className="w-fit">
          <CTAButton active={true} linkTo={"/signup"}>
            <div className="flex items-center gap-3 font-semibold">
              Start Teaching Today
              <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
