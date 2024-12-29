import React from "react";
import CTAButton from "../../Common/Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
const CodeBlocks = ({
  position,
  heading,
  subHeading,
  ctaBtn1,
  ctaBtn2,
  codeBlock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-20 w-[100%]`}>
      {/* //*Section1 for HEADING AND BUTTONS*/}
      <div className="w-1/2 flex flex-col gap-8 ">
        {heading}
        <div className="text-richblack-300 ">{subHeading}</div>

        <div className="flex items-center gap-8 mt-10">
          <CTAButton active={ctaBtn1.active} linkTo={ctaBtn1.linkTo}>
            <div className="flex gap-2 items-center">
              {ctaBtn1.text}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctaBtn2.active} linkTo={ctaBtn2.linkTo}>
            {ctaBtn2.text}
          </CTAButton>
        </div>
      </div>
      {/* //*Section FOR HTML CODE UI*/}
      <div className="h-fit w-[50%] min-w-[340px] m-auto flex flex-row py-4 text-[12px] font-bold">
        {/* Gradient */}
        <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
          <p>12</p>
          <p>13</p>
          <p>14</p>
        </div>
        {/* //*Animation for text */}
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}
        >
          <TypeAnimation
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            sequence={[codeBlock, 1000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
