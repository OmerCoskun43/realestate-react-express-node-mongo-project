import { FaSearch } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/features/userSlice";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-blue-200 shadow-md">
      <div className="flex justify-evenly gap-4 sm:gap-0  sm:justify-between items-center max-w-6xl mx-auto px-1 py-2 ">
        <div onClick={() => navigate("/")}>
          <img
            className="w-[80px] ms-10 sm:ms-0  md:w-[120px] object-cover cursor-pointer "
            src="/image5.png"
            alt=""
          />
        </div>
        <form className="bg-white  p-3 rounded-lg flex items-center " action="">
          <input
            type="text"
            placeholder="Search..."
            className=" bg-white px-2 py-1 rounded-lg focus:outline-none   w-[140px] sm:w-64 placeholder:text-red-500 "
          />
          <FaSearch className="text-slate-600 cursor-pointer " />
        </form>
        <ul className="flex gap-4 justify-center items-center">
          <NavLink
            to="/"
            style={({ isActive }) => {
              return {
                color: isActive ? "red" : "black",
              };
            }}
            className="hidden font-bold sm:inline cursor-pointer  text-slate-600 hover:underline"
          >
            Home{" "}
          </NavLink>
          <NavLink
            to="/about"
            style={({ isActive }) => {
              return {
                color: isActive ? "red" : "black",
              };
            }}
            className="hidden font-bold sm:inline cursor-pointer  text-slate-600 hover:underline"
          >
            About{" "}
          </NavLink>

          {!currentUser && (
            <NavLink
              to="/sign-in"
              style={({ isActive }) => {
                return {
                  color: isActive ? "red" : "black",
                };
              }}
              className=" hidden font-bold sm:inline cursor-pointer  text-slate-600 hover:underline"
            >
              Sign In{" "}
            </NavLink>
          )}

          {currentUser && (
            <NavLink
              to="/"
              // style={({ isActive }) => {
              //   return {
              //     color: isActive ? "red" : "black",
              //   };
              // }}
              className=" hidden font-bold sm:inline cursor-pointer  text-black hover:underline"
              onClick={() => {
                dispatch(signOutSuccess());
              }}
            >
              Sign Out{" "}
            </NavLink>
          )}

          {!currentUser && (
            <NavLink
              to="/sign-up"
              style={({ isActive }) => {
                return {
                  color: isActive ? "red" : "black",
                };
              }}
              className=" hidden font-bold sm:inline cursor-pointer  text-slate-600 hover:underline"
            >
              Sign Up{" "}
            </NavLink>
          )}

          <NavLink
            to="/profile"
            style={({ isActive }) => {
              return {
                color: isActive ? "red" : "black",
              };
            }}
            className="hidden font-bold sm:inline cursor-pointer  text-slate-600 hover:underline"
          >
            {currentUser && (
              <div className="flex items-center flex-col px-1 py-3 justify-center gap-1 ">
                <img
                  className="rounded-full h-7 w-7 object-cover  "
                  src={currentUser?.avatar}
                  alt="avatar"
                />
                <span className="text-black  font-bold  ">
                  {" "}
                  {currentUser?.username}
                </span>
              </div>
            )}
          </NavLink>
        </ul>
      </div>
    </header>
  );
};

export default Header;
