import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { contactUsEndpoint } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import CountryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNumber: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  const submitContactForm = async (data) => {
    // console.log("Loading data", data);
    const toastId = toast.loading("Sending message now.");
    setLoading(true);
    try {
      const response = await apiConnector(
        "POST",
        contactUsEndpoint.CONTACT_US_API,
        data
      );
      // console.log("logging response", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Message send. We will contact you soon.");
    } catch (error) {
      console.log("submitContactForm error " + error);
      setLoading(false);
      toast.error("Couldn't register your message.");
    }
    toast.dismiss(toastId);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      className="flex flex-col gap-7"
    >
      {/* Name Field */}
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* firstName */}
        <div className="flex flex-col gap-1 lg:w-[48%]">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="John"
            className="p-2 rounded-md text-richblack-900"
            {...register("firstName", { required: true })}
          />
          {errors.firstName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your First Name.
            </span>
          )}
        </div>
        {/* lastName */}
        <div className="flex flex-col gap-1 lg:w-[48%]">
          <label htmlFor="lastName" className="label-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Doe"
            className="p-2 rounded-md text-richblack-900"
            {...register("lastName")}
          />
          {errors.lastName && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your Last Name.
            </span>
          )}
        </div>
      </div>
      {/* email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="label-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="johndoe123@mail.com"
          className="text-richblack-900 p-2 rounded-md"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your email address.
          </span>
        )}
      </div>
      {/* Phone Number */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phoneNumber">Phone Number</label>
        <div className="flex">
          <select
            className="text-richblack-900 w-[67px]  p-1 rounded-s-md"
            name="countryCode"
            id="countryCode"
            {...register("countryCode", { required: true })}
          >
            {CountryCode.map((item, index) => {
              return (
                <option key={index} value={item.code}>
                  {item.code} - {item.country}
                </option>
              );
            })}
          </select>
          {errors.countryCode && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              County Code is required
            </span>
          )}
          <input
            className="text-richblack-900 w-full  px-3 py-2 rounded-e-md"
            type="number"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="987 3241 111"
            {...register("phoneNumber", {
              required: { value: true, message: "Phone number is required." },
              maxLength: { value: 10, message: "Invalid Phone Number." },
              minLength: { value: 8, message: "Invalid Phone Number." },
            })}
          />
          {errors.phoneNumber && (
            <span className="m-1 text-[12px] text-yellow-100">
              Valid phone number is required
            </span>
          )}
        </div>
      </div>
      {/* message */}
      <div className="flex flex-col gap-1">
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="10"
          placeholder="Enter your message."
          className="p-2 rounded-md text-richblack-900"
          {...register("message", { required: true })}
        ></textarea>
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your message.
          </span>
        )}
      </div>
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[16px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
          ${
            !loading &&
            "transition-all duration-200 hover:scale-95 hover:shadow-none"
          }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactUsForm;
