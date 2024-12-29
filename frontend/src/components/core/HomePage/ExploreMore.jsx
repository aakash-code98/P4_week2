import { React, useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "../../Common/HighlightText";
const tabNames = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];
const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabNames[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCard = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((item) => item.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className=" relative flex flex-col gap-10">
      <div>
        <div className="text-4xl font-bold text-center">
          Unlock the <HighlightText text={"Power of Code"} />
        </div>
        <p className="text-center text-richblack-400  text-base mt-3">
          Learn to build anything you can imagine.
        </p>
      </div>
      {/*//*Tab */}
      <div className="mx-auto w-fit flex flex-row items-center gap-2 text-center bg-richblack-700 p-1 rounded-full">
        {tabNames.map((el, index) => {
          return (
            <div
              className={`${
                currentTab === el
                  ? "bg-richblack-900 text-white font-medium"
                  : "text-richblack-200 cursor-pointer hover:bg-richblack-800 hover:text-richblack-25 "
              } px-4 py-2  rounded-full transition-all duration-600 `}
              key={index}
              onClick={() => {
                setMyCard(el);
              }}
            >
              {el}
            </div>
          );
        })}
      </div>
      <div className="lg:h-[250px]"></div>
      {/*//*Cards */}
      <div className=" absolute -bottom-16 -right-[10.5rem] flex flex-row gap-9 mx-auto justify-around">
        {courses.map((el, index) => {
          return (
            <div
              className={`w-[320px] h-[300px] bg-richblack-800 flex flex-col ${
                currentCard === el.heading
                  ? "bg-white shadow-[15px_15px_0px_0px_#FFD60A] text-blue-400"
                  : "text-richblack-400"
              }`}
              key={index}
              onClick={() => {
                setCurrentCard(el.heading);
              }}
            >
              <div className="h-4/5 mt-1 p-5 flex flex-col gap-4 text-richblack-400">
                <h3
                  className={`text-xl font-bold ${
                    currentCard === el.heading
                      ? "text-richblack-900"
                      : "text-richblack-25 "
                  }`}
                >
                  {el.heading}
                </h3>
                <p className="text-[16px] font-normal ">{el.description}</p>
              </div>
              <span className="border-t-2 border-dashed border-richblack-600"></span>
              <div className="flex flex-row justify-between p-4 text-[16px] font-normal ">
                <div>{el.level}</div>
                <div>{el.lessonNumber}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;
