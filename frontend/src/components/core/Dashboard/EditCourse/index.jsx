import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CourseBuilderSteps from "../AddCourse/CourseBuilderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsApi";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const populateCourseDetails = async () => {
      setLoading(true);
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    };

    populateCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-richblack-5">
      {loading ? (
        <div className="grid flex-1 place-items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          <h1 className="mb-14 text-3xl font-medium text-richblack-5">
            Edit Course
          </h1>
          <div className="mx-auto max-w-[600px]">
            {course ? (
              <CourseBuilderSteps />
            ) : (
              <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                Course not found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCourse;
