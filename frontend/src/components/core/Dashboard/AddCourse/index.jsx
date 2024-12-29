import CourseBuilderSteps from "./CourseBuilderSteps";
export default function AddCourse() {
  return (
    <>
      <div className="text-white w-11/12 flex gap-8">
        <div className="w-8/12 flex flex-col gap-8 ">
          <h1 className="text-2xl font-semibold">Add Course</h1>
          <div>
            <CourseBuilderSteps />
          </div>
        </div>
        <div className="w-4/12 flex flex-col gap-4">
          <p className=" text-sm font-semibold">Code Upload Tips</p>
          <ul className="flex flex-col gap-2 text-xs text- list-disc">
            <li className="list-item">Set the Course Price option or make it free.</li>
            <li className="list-item">Standard size for the course thumbnail is 1024x576.</li>
            <li className="list-item">Video section controls the course overview video.</li>
            <li className="list-item">Course Builder is where you create & organize a course.</li>
            <li className="list-item">
              Add Topics in the Course Builder section to create lessons,
              quizzes, and assignments.
            </li>
            <li className="list-item">
              Information from the Additional Data section shows up on the
              course single page.
            </li>
            <li className="list-item">Make Announcements to notify any important</li>
            <li className="list-item">Notes to all enrolled students at once.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
