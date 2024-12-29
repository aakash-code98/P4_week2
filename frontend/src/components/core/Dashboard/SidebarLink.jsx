import React from "react";
import * as Icons from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { useLocation, matchPath, NavLink } from "react-router-dom";

const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName];
  const location = useLocation();
  const dispatch = useDispatch();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div>
      <NavLink
        to={link.path}
        className={`relative flex px-8 py-2 text-sm text-richblack-5 font-medium ${
          matchRoute(link.path)
            ? "bg-yellow-800 w-full "
            : "bg-opacity-0"
        } `}
      >
        <span
          className={`${
            matchRoute(link.path) ? "opacity-100" : "opacity-0"
          } absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-300`}
        ></span>
        <div className="flex items-center gap-x-2">
          <Icon />
          <span>{link.name}</span>
        </div>
      </NavLink>
    </div>
  );
};

export default SidebarLink;
