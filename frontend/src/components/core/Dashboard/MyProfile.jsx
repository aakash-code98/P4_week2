import React from "react";
import IconBtn from "../../Common/IconBtn";
import { formattedDate } from "../../../utils/dateFormatter";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  return (
    <article className="flex flex-col gap-8 p-4 rounded-md text-white mx-auto w-10/12">
      <h1 className="text-2xl font-bold">My Profile</h1>
      {/* //*Section 1 */}
      <section className="flex justify-between items-center   p-7 rounded-md bg-richblack-800">
        <div className="flex gap-2">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="text-lg font-bold">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-md text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onClick={() => {
            navigate("/dashboard/setting");
          }}
          customClasses="text-richblack-800 flex gap-2 py-2 px-4 bg-yellow-100 rounded-md items-center"
        >
          <LiaEditSolid  />
        </IconBtn>
      </section>
      {/* //*Section 2 */}
      <section className=" flex flex-col gap-2 p-7 rounded-md bg-richblack-800">
        <div className="flex justify-between">
          <p className="text-2xl font-bold">About</p>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/setting");
            }}
            customClasses="text-richblack-800 flex gap-2 py-2 px-4 bg-yellow-100 rounded-md items-center"
          >
            <LiaEditSolid  />
          </IconBtn>
        </div>
        <p className="text-md text-richblack-50">
          {user?.additionalDetails?.about ?? "Write something about your self"}
        </p>
      </section>
      {/* //*Section 3 */}
      <section className="flex flex-col gap-2 p-7 rounded-md bg-richblack-800">
        <div className="flex justify-between">
          <p className="text-2xl font-bold">Personal Details</p>
          <IconBtn
            text="Edit"
            onClick={() => {
              navigate("/dashboard/setting");
            }}
            customClasses="text-richblack-800 flex gap-2 py-2 px-4 bg-yellow-100 rounded-md items-center"
          >
            <LiaEditSolid  />
          </IconBtn>
        </div>
        <div className="flex flex-col lg:flex-row max-w-[500px] justify-between text-md gap-5 text-richblack-5">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-300">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-300">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default MyProfile;
