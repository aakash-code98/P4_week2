import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../../../../Common/ConfirmationModal";
import SubSectionModal from "./SubSectionModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsApi";
import { setCourse } from "../../../../../slices/courseSlice";
import { BiSolidDownArrow } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // const [loading, setLoading] = useState(null);
  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    );
    if (result) dispatch(setCourse(result));
    setConfirmationModal(null);
  };
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId }, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };
  return (
    <div className="w-11/12 p-5 bg-richblack-700 rounded-lg">
      <div
        className="bg-richblack-700 rounded-lg p-6 px-8"
        id="nestedViewContainer"
      >
        {course.courseContent.map((section) => (
          //Section Dropdown
          <details key={section._id} open className="flex text-sm m-2">
            <summary className="flex cursor-pointer items-center justify-between border-b-richblack-600 my-2 py-2 border-b-2 border-richblack-400 text-richblack-300">
              <div className="flex items-center gap-2 ">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() => {
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    );
                  }}
                >
                  <MdEdit className="text-xl text-richblack-300" size={18} />
                </button>
                <button
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Delete this Section",
                      text2:
                        "All these Lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                  }}
                >
                  <RiDeleteBin5Line
                    className="text-xl text-richblack-300"
                    size={18}
                  />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <BiSolidDownArrow
                  className="text-xl text-richblack-300"
                  size={18}
                />
              </div>
            </summary>
            <div>
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit
                        size={18}
                        className="text-xl text-richblack-300"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Delete this Sub Section",
                          text2: "All the data in this Lesson will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                    >
                      <RiDeleteBin5Line
                        size={18}
                        className="text-xl text-richblack-300"
                      />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setAddSubSection(section._id);
                }}
                className="mt-4 flex gap-x-2 text-yellow-50 items-center"
              >
                <AiOutlinePlus className="text-lg" />
                <p>Add Lesson</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add //argument which is true implicitly even if it is not assigned true explicitly
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit
        />
      ) : null}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default NestedView;
