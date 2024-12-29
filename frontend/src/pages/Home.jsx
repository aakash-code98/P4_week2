import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import HighlightText from "../components/Common/HighlightText";
import CTAButton from "../components/Common/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearnLanguageSection from "../components/core/HomePage/LearnLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ReviewSection from "../components/core/HomePage/ReviewSection";
import ReviewSlider from "../components/Common/ReviewSlider";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/Common/Footer";

const Home = () => {
  return (
    <div>
      {/*//# Section 1 Dark Part*/}
      <div className="relative w-11/12 mx-auto max-w-maxContent flex flex-col items-center text-white ">
        {/*//* --------Hero Section Start-------- */}
        <div className="flex flex-col gap-8 ">
          <Link to={"/signup"}>
            <div className="w-fit mt-16 mx-auto px-10 py-[5px] font-bold text-richblack-200 bg-richblack-800 border-4 border-richblack-800 rounded-full flex flex-row items-center gap-2  transition-all duration-200 hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </Link>
          <div className="text-center text-4xl font-bold">
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
          </div>
          <div className="w-[80%] mx-auto text-center font-semibold text-richblack-300">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </div>
          <div className="flex flex-row justify-center gap-8 ">
            <CTAButton active={true} linkTo={"/signup"}>
              Learn More
            </CTAButton>
            <CTAButton active={false} linkTo={"/login"}>
              Book A Demo
            </CTAButton>
          </div>
          <div className="mx-4 my-12 shadow-blue-200 ">
            <video muted loop autoPlay>
              <source src={Banner} type="video/mp4" />
            </video>
          </div>
        </div>
        {/*//* --------Hero Section End-------- */}

        {/*//*--------CodeBlock Section Start--------*/}
        <div>
          {/* codeblock part 1 */}
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-4xl font-semibold">
                Unleash Your
                <HighlightText text={"coding potential"}></HighlightText> with
                our online courses.
              </div>
            }
            subHeading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctaBtn1={{
              text: "Try It Yourself",
              linkTo: "/signup",
              active: true,
            }}
            ctaBtn2={{
              text: "Learn More",
              linkTo: "/login",
              active: false,
            }}
            codeBlock={`<!DOCTYPE html>\n<html>\n<head>\n <title>Example</title>\n<link rel="stylesheet" href= "style.css">\n</head>\n<body>\n<h1><a href= "/">Header</a></h1>\n<nav>\n<a href= "/one">One</a>\n<a href= "/two">two</a>\n</nav>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
          />
          {/* codeblock part 2 */}
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={"coding in seconds"}></HighlightText>
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctaBtn1={{
              text: "Continue Lesson",
              linkTo: "/signup",
              active: true,
            }}
            ctaBtn2={{
              text: "learn More",
              linkTo: "/login",
              active: false,
            }}
            codeBlock={`<!DOCTYPE html>\n<html>\n<head>\n <title>Example</title>\n<link rel="stylesheet" href= "style.css">\n</head>\n<body>\n<h1><a href= "/">Header</a></h1>\n<nav>\n<a href= "/one">One</a>\n<a href= "/two">two</a>\n</nav>\n</body>\n</html>`}
            codeColor={"text-yellow-25"}
          />
        </div>
        {/*//*--------CodeBlock Section End--------*/}
        {/*//*--------Explore More Section start--------*/}
        <ExploreMore />
        {/*//*--------Explore More Section End--------*/}
      </div>
      {/*//# Section 1 Dark Part End*/}

      {/*//*--------Catalog Section Start--------*/}
      <div className="bg-pure-greys-5 text-richblack-700 homepage_bg h-[324px]">
        <div className="w-11/12 max-w-maxContent h-full flex flex-col items-center justify-center mx-auto gap-5">
          <div className="flex flex-row  justify-center text-white gap-7 w-full">
            <CTAButton active={true} linkTo={"/signup"}>
              <div className="flex items-center gap-3">
                Explore Full Catalog
                <FaArrowRight />
              </div>
            </CTAButton>
            <CTAButton active={false} linkTo={"/signup"}>
              Learn More
            </CTAButton>
          </div>
        </div>
      </div>
      {/*//*--------Catalog Section End--------*/}
      {/*//# Section 2 Light Part Start*/}
      <div className="bg-pure-greys-5 text-richblack-700 ">
        <div className="w-11/12 max-w-maxContent flex flex-col gap-12 items-center mx-auto mb-10">
          <div className="flex flex-row justify-between w-full  mt-20 gap-5 ">
            <div className="text-4xl font-semibold w-[55%]">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="w-[40%] flex flex-col gap-5">
              <p className="text-[16px] w-[90%]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <div className="w-fit">
                <CTAButton active={true} linkTo={"/signup"}>
                  Learn More
                </CTAButton>
              </div>
            </div>
          </div>
          <TimelineSection />
          <LearnLanguageSection />
        </div>
      </div>
      {/*//# Section 2 Light Part End*/}

      {/*//# Section 3 Dark Part Start*/}

      <div className="mt-16 w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
      </div>

      {/*//# Section 3 Dark Part End*/}

      {/*//# Footer */}
      <Footer/>
    </div>
  );
};

export default Home;
