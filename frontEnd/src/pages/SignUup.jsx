/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";

const SignUup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData==> ", formData);
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
    setLoading(false);
    setError(null);
    setFormData({});
    navigate("/sign-in");
  };
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
      <form action="" className="flex flex-col  gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Username"
          className="border p-3 rounded-lg"
          id="username"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
        />

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
          className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4  uppercase rounded disabled:opacity-80"
          type="submit"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <GoogleAuth />
      </form>
      <div className="flex gap-2 mt-3">
        <p>Already have an account?</p>
        <Link to="/sign-in" className="text-red-500 hover:underline">
          Sign In
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignUup;
