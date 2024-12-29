import React from "react";
import IconBtn from "./IconBtn";

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm ">
      <div className="w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
          {modalData.text1}
        </p>
        <p className="mt-3 mb-5 leading-6 text-richblack-100">
          {modalData.text2}
        </p>
        <div className="flex items-center gap-x-4">
          <IconBtn
            onClick={modalData?.btn1Handler}
            text={modalData?.btn1Text}
            customClasses="px-4 py-2 bg-yellow-100 text-richblack-800 font-semibold rounded-md"
          />
          <IconBtn
            onClick={modalData?.btn2Handler}
            text={modalData?.btn2Text}
            customClasses="cursor-pointer rounded-md text-richblack-800 font-semibold bg-richblack-50 py-[8px] px-[20px]  text-richblack-900"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
