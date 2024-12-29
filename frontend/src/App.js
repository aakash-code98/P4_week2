import { Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Navbar from "./components/Common/Navbar.jsx";
import Cart from "./components/core/Dashboard/Cart/index.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import MyProfile from "./components/core/Dashboard/MyProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./components/core/Dashboard/Settings/index.jsx";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses.jsx";
import Error from "./pages/Error.jsx";
import { ACCOUNT_TYPE } from "./utils/constants.js";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse/index.jsx";
import MyCourses from "./components/core/Dashboard/MyCourses.jsx";
import EditCourse from "./components/core/Dashboard/EditCourse/index.jsx";
function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="change-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="about"
          element={
            <OpenRoute>
              <About />
            </OpenRoute>
          }
        />
        <Route path="contact" element={<ContactUs />} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/setting" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
