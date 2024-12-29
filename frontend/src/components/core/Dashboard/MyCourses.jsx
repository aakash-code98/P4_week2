import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsApi";
import IconBtn from "../../Common/IconBtn";
import { AiOutlinePlus } from "react-icons/ai";
import CoursesTable from "./InstructorCourses/CoursesTable";
const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="text-richblack-5">
      <div className="flex justify-between">
        <h1>My Courses</h1>
        <IconBtn
          text="Add Course"
          onClick={() => {
            navigate("/dashboard/add-course");
          }}
        >
          <AiOutlinePlus
            size={18}
            className="text-richblack-800 font-bold"
          ></AiOutlinePlus>
        </IconBtn>
      </div>
      {
        //Course table
        courses && <CoursesTable courses={courses} setCourses={setCourses} />
      }
    </div>
  );
};

export default MyCourses;
