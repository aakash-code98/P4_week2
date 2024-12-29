import React from "react";
import HighlightText from "../../Common/HighlightText";
import CTAButton from "../../Common/Button";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png";
import CompareWithOthers from "../../../assets/Images/Compare_with_others.png";
import PlanYourLessons from "../../../assets/Images/Plan_your_lessons.png";

const LearnLanguageSection = () => {
  return (
    <div className="flex flex-col items-center gap-6 my-16 ">
      <div className="text-4xl font-semibold text-center">
        Your swiss knife for <HighlightText text="learning any language." />
      </div>
      <div className="text-center text-richblack-600 mx-auto w-[70%] font-medium text-base">
        Using spin making learning multiple languages easy. with 20+ languages
        realistic voice-over, progress tracking, custom schedule and more.
      </div>
      <div className="flex flex-row item-center justify-center -my-6 ">
        <img
          src={KnowYourProgress}
          alt="Know Your Progress in Dashboard"
          className="object-contain -mr-24"
        />
        <img
          src={CompareWithOthers}
          alt="Compete With Others in LeaderBoard."
          className="object-contain"
        />
        <img
          src={PlanYourLessons}
          alt="Plan Your Lesson in Dashboard"
          className="object-contain -ml-32"
        />
      </div>
      <div className="w-fit">
        <CTAButton active={true} linkTo="/signup">
          Learn More
        </CTAButton>
      </div>
    </div>
  );
};

export default LearnLanguageSection;
