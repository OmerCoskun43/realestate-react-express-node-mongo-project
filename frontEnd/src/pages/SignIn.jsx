/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "../redux/features/userSlice";
import GoogleAuth from "../components/GoogleAuth";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data?.message));
        return;
      }
      dispatch(signInSuccess(data));
      // console.log(data);

      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

    setFormData({});
  };
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form action="" className="flex flex-col  gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        <button
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded uppercase disabled:opacity-80"
          type="submit"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <GoogleAuth />
      </form>
      <div className="flex gap-2 mt-3">
        <p>Do not have an account?</p>
        <Link to="/sign-up" className="text-red-500 hover:underline">
          Sign Up
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;
