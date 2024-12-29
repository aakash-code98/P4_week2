import React, { useEffect, useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import logoLight from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoIosArrowDropdownCircle } from "react-icons/io";
const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  let location = useLocation();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const [subLinks, setSublinks] = useState([]);
  const fetchSublinks = async () => {
    try {
      const result = [{name: 'coming soon'}]
      setSublinks(result);
    } catch (error) {
      console.log(
        "Could not fetch the sub link for categories of navbar" + error
      );
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  return (
    <div className="h-14 border-b-[1px] border-b-richblack-700 flex items-center">
      <div className=" w-11/12 flex items-center justify-between max-w-maxContent mx-auto ">
        {/*//* Logo */}
        <Link to="/">
          <img
            src={logoLight}
            alt="StudyNotion Logo"
            width={160}
            height={42}
            loading="lazy"
          />
        </Link>
        {/*//* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((item, index) => {
              return (
                <li key={index}>
                  {item.title === "Catalog" ? (
                    <div className="relative flex justify-center items-center gap-2 group">
                      <p>{item.title}</p>
                      <IoIosArrowDropdownCircle />
                      <div className="invisible absolute left-[50%] top-[45px] translate-x-[-50%] flex flex-col rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100 lg:w-[300px] z-10">
                        <div className=" absolute left-[50%] top-0 translate-y-[-45%] translate-x-[80%] h-6 w-6 rotate-45 rounded bg-richblack-5 "></div>
                        {subLinks.length ? (
                          <>
                            {subLinks.map((item, index) => {
                              return (
                                <div key={index}>
                                  
                                    <p className="px-4 py-2">{item.name}</p>
                                  
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={item.path}>
                      <p
                        className={`${
                          matchRoute(item?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {item.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {/* //*Login/Signup/Dashboard */}
        <div className="flex gap-x-4 items-center">
          {token === null && (
            <>
              <Link to="/login">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Log In
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Sign Up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropDown />}
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
