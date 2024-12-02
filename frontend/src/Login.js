import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      try {
        const res = await axios.post("http://localhost:8081/login", values);
        console.log(res.data);
        if (res.data.message === "Login successful") {
          navigate("/home");
        } else {
          alert("Invalid email or password");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: "#F0FFF0" }} className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h1 className="text-center"><strong>Welcome to SnackHack!</strong></h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email</strong></label>
            <input type="email" name="email" placeholder="Enter Email" onChange={handleInput} className="form-control rounded-0"
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password</strong></label>
            <input type="password" name="password" placeholder="Enter Password" onChange={handleInput} className="form-control rounded-0"
            />
            {errors.password && <span className="text-danger">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-success w-100" style={{ borderRadius: "20px" }}>
            Log in
          </button>
          <Link to="/signup" className="btn btn-outline-success w-100 mt-3" style={{ borderRadius: "20px" }}>
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
/* resending the old version */