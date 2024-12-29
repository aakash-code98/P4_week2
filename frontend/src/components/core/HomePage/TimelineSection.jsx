import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timeLineImage from "../../../assets/Images/TimelineImage.png";
const timeLine = [
  {
    logo: Logo1,
    heading: "Leadership",
    description: "Fully committed to company's success",
    logoAlt: "Leadership logo",
  },
  {
    logo: Logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority",
    logoAlt: "Responsibility logo",
  },
  {
    logo: Logo3,
    heading: "Flexibility",
    description: "The ability to switch us an important skill",
    logoAlt: "Flexibility logo",
  },
  {
    logo: Logo4,
    heading: "Solve The Problem",
    description: "Code your way to a solution",
    logoAlt: "Solve The Problem logo",
  },
];
const TimelineSection = () => {
  return (
    <div className="flex flex-row gap-20 items-center">
      <div className="flex flex-col w-2/5 justify-around gap-10">
        {timeLine.map((el, index) => {
          return (
            <div className={"flex flex-row gap-3"} key={index}>
              <div className={"w-[50px] bg-white flex items-center"}>
                <img src={el.logo} alt={el.logoAlt} />
              </div>
              <div>
                <h2 className="font-semibold">{el.heading}</h2>
                <p className="text-base">{el.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-3/5 shadow-blue-200">
        <img
          src={timeLineImage}
          alt="A women using a laptop to code."
          className="shadow-blue-200 object-cover"
        />
        <div className="absolute bg-caribbeangreen-700 flex flex-row text-white py-8 uppercase left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-200 px-9">
            <p className="text-3xl font-semibold">10</p>
            <p className="text-caribbeangreen-200 text-sm">
              Years of Experience
            </p>
          </div>
          <div className="flex flex-row gap-5 items-center px-9">
            <p className="text-3xl font-semibold">250</p>
            <p className="text-caribbeangreen-200 text-sm">Types of Courses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
