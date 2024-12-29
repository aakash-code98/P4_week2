import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { courseEndpoints } from "../apis";

const {
  //create
  CREATE_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  CREATE_RATING_API,
  // Read
  GET_ALL_COURSE_API,
  COURSE_DETAILS_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  COURSE_CATEGORIES_API,
  //update
  UPDATE_SECTION_API,
  EDIT_COURSE_API,
  UPDATE_SUBSECTION_API,
  LECTURE_COMPLETION_API,
  //delete
  DELETE_COURSE_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
} = courseEndpoints;

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error);
    toast.error("Could Not Fetch Course Categories");
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...");
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    console.log("COURSE_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response?.data?.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error);
    toast.error("Couldn't get Course Details");
  }
  toast.dismiss(toastId);
  //   dispatch(setLoading(false));
  return result;
};

export async function addCourseDetails(token, courseData) {
  let result = null;
  const toastId = toast.loading("Creating Your Course.");
  try {
    let auth = `Bearer ${token}`;
    const response = await apiConnector("POST", CREATE_COURSE_API, courseData, {
      Authorization: auth,
    });
    if (!response.data.success) throw new Error(response?.data?.message);
    result = response?.data?.data;
    toast.success("Course Created Successfully.");
  } catch (error) {
    console.log("Error while creating course---------", error);
    toast.error("Sorry couldn't create your course.");
  }
  toast.dismiss(toastId);
  return result;
}
export async function editCourseDetails(token, courseData) {
  let result = null;
  const toastId = toast.loading("Saving your changes.");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, courseData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) throw new Error(response?.data?.message);
    result = response?.data?.data;
    toast.success("Changes saved successfully.");
  } catch (error) {
    console.log("Error while saving changes to course---------", error);
    toast.error("Sorry couldn't save your changes.");
  }
  toast.dismiss(toastId);
  return result;
}

export async function fetchCourseCategories() {
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      COURSE_CATEGORIES_API,
      null,
      null
    );
    if (!response.data.success) throw new Error(response?.data?.message);
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE CATEGORIES API ERROR---------", error);
    toast.error("Sorry couldn't fetch Categories");
  }
  return result;
}

export async function createSection(data, token) {
  let result = null;
  let toastId = toast.loading("Loading...");
  try {
    let response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) throw new Error(response?.data?.message);
    result = response?.data?.data;
    toast.success("Lesson created successfully");
  } catch (error) {
    console.log("CREATE SECTION API ERROR --- ", error);
    toast.error("Failed to create a Lesson");
  }
  toast.dismiss(toastId);
  return result;
}

export async function updateSection(data, token) {
  let result = null;
  const toastId = toast.loading("Updating...");
  try {
    let response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SECTION API --- ", response);
    if (!response?.data?.success) {
      throw new Error("Could not update Lesson");
    }
    toast.success("Lesson updated successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Update Section API error ---- ", error);
    toast.error("Failed to update Lesson");
  }
  toast.dismiss(toastId);
  return result;
}

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SUB-SECTION API RESPONSE ---", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR ---", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export async function updateSubSection(data, token) {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    let response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE SUBSECTION API --- ", response);
    if (!response?.data?.success) {
      throw new Error("Could not update Sub Section");
    }
    toast.success("Course Sub Section Updated");
    result = response?.data?.data;
  } catch (error) {
    console.log("Update Sub Section API error ---- ", error);
    toast.error("sorry couldn't update Sub Section.");
  }
  toast.dismiss(toastId);
  return result;
}

// delete a section
export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SECTION API RESPONSE --- ", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Lesson deleted successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE SECTION API ERROR --- ", error);
    toast.error("Could not delete lesson");
  }
  toast.dismiss(toastId);
  return result;
};
// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SUB-SECTION API RESPONSE --- ", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Lecture deleted successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR --- ", error);
    toast.error("Could not delete Lecture");
  }
  toast.dismiss(toastId);
  return result;
};

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("INSTRUCTOR COURSES API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error("Could not fetch Instructor Courses");
  }
  toast.dismiss(toastId);
  return result;
};

// delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE COURSE API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Course Deleted");
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error);
    toast.error("Could not delete Course");
  }
  toast.dismiss(toastId);
};

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  //   dispatch(setLoading(true));
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error);
    toast.error("Sorry couldn't get Course details");
  }
  toast.dismiss(toastId);
  //   dispatch(setLoading(false));
  return result;
};

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = false;
  console.log("mark complete data", data);
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log(
      "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
      response
    );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture marked as Completed");
    result = true;
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error);
    toast.error("Sorry, failed to mark lecture as completed");
  }
  toast.dismiss(toastId);
  return result;
};

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE RATING API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Rating Created successfully");
    success = true;
  } catch (error) {
    success = false;
    console.log("CREATE RATING API ERROR............", error);
    toast.error("Could Not Create Rating");
  }
  toast.dismiss(toastId);
  return success;
};
