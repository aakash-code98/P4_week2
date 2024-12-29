import React, { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

const RequirementField = ({
  name,
  label,
  placeholder,
  register,
  errors,
  setValue,
  getValues,
}) => {
  const [requirement, setRequirement] = useState("");
  const [requirementsList, setRequirementsList] = useState([]);
  const handleAddRequirement = () => {
    if (requirement) {
      setRequirementsList([...requirementsList, requirement]);
      setRequirement("");
    }
  };
  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setValue(name, requirementsList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList]);

  const handleRemoveRequirement = (index) => {
    const updatedRequirementsList = [...requirementsList];
    updatedRequirementsList.splice(index, 1);
    setRequirementsList(updatedRequirementsList);
  };
  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={name} className="text-richblack-100">
        {label} <sup className="text-pink-300">*</sup>
      </label>
      <input
        type="text"
        value={requirement}
        id={name}
        placeholder={placeholder}
        onChange={(e) => setRequirement(e.target.value)}
        className="w-full rounded-sm py-2 px-4 bg-richblack-700 "
      />
      {errors[name] && (
        <span className="-mt-1 text-yellow-100 text-xs">
          Please Enter Course Requirements.
        </span>
      )}
      <button
        type="button"
        onClick={handleAddRequirement}
        className="w-fit py-2 px-3 rounded-md flex gap-1 items-center bg-richblack-800 text-center text-xs text-yellow-100 border-[1px] border-yellow-200"
      >
        Add <BiPlus />
      </button>

      {requirementsList.length > 0 && (
        <ul className="flex flex-col gap-2 text-richblack-25">
          {requirementsList.map((item, index) => (
            <li className="w-full flex" key={index}>
              <span className="w-5/6 ">{item}</span>
              <button
                type="button"
                className="w-1/6 px-1 py-1 rounded-md flex gap-1 items-center text-xs  text-yellow-500 border-[1px]  border-yellow-600"
                onClick={() => handleRemoveRequirement(index)}
              >
                <BiMinus />
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequirementField;
