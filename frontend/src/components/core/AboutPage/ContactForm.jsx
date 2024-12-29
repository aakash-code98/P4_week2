import React from "react";
import ContactUsForm from "../../Common/ContactUsForm";

const ContactForm = () => {
  return (
    <div className="mx-auto">
      <h2 className="text-center text-4xl font-semibold">Get in Touch</h2>
      <p className="text-center text-richblack-300 mt-3">
        We'd love to here from you. Please fill out this form.
      </p>
      <div className="mt-12 mx-auto">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
