import React from "react";
import { useSelector } from "react-redux";
import CartCourses from "./CartCourses";
import TotalAmount from "./TotalAmount";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.auth);
  return (
    <div className="text-white">
      <h1>Your Cart</h1>
      <p>{totalItems} Courses in cart</p>
      {total > 0 ? (
        <div>
          <CartCourses />
          <TotalAmount />
        </div>
      ) : (
        <p>Your cart is Empty.</p>
      )}
    </div>
  );
}
