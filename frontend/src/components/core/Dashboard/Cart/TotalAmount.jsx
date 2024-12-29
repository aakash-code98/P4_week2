import React from "react";
import { useSelector } from "react-redux";
import IconBtn from "../../../Common/IconBtn";

const TotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);

  const handleBuyCourse = () => {
    const courses = cart.filter((course) => course._id);
    console.log("Bought these courses: ", courses);
    //TODO: Api integration
  };

  return (
    <div>
      <p>Total:</p>
      <p>Rs {total}</p>
      <IconBtn
        text="Buy Now"
        onClick={handleBuyCourse}
        customClasses={"w-full items-center justify-center"}
      />
    </div>
  );
};

export default TotalAmount;
