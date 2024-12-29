import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Unable to fetch enrolled courses." + error);
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  },[]);

  return (
    <div className="text-white">
      <h1>Enrolled Courses</h1>
      {!enrolledCourses ? (
        <div>Loading...</div>
      ) : !enrolledCourses.length ? (
        <div>You have not enrolled in any courses yet.</div>
      ) : (
        <div>
          <div>Tab Element</div>
          <div>
            <div>
              <p>Course Name</p>
              <p>Duration</p>
              <p>Progress</p>
            </div>
            {/*//*Cards */}
            {enrolledCourses.map((course, index) => {
              return (
                <div key={index}>
                  <div>
                    <img src={course.thumbnail} alt="Course Thumbnail" />
                    <p>{course.name}</p>
                    <p>{course.description}</p>
                  </div>
                  <div>{course?.totalDuration}</div>
                  <div>
                    <label for="progressBar">
                      Progress: {course.progressPercentage || 0}
                    </label>
                    <progress
                      value={course.progressPercentage || 0}
                      max={100}
                      className="bg-yellow-5 text-blue-100 h-[8px]"
                      id="progressBar"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
