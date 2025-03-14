import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { API, axios } from "../../Common/Constants";
import { checkEmail } from "../../Helpers/Auth/CheckEmail";
import Loader from "../../Components/Loader";
import { encryptAuthBody } from "../../Helpers/Auth/AuthCipher";
import { useAuth } from "../../Common/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Function to validate email
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@j3mail\.com$/.test(email);
  };

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate email
    if (name === "email") {
      if (!validateEmail(value)) {
        setErrors({ ...errors, email: "Invalid email format" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }

    // Validate password
    if (name === "password") {
      if (value.length < 6) {
        setErrors({
          ...errors,
          password: "Password must be at least 6 characters",
        });
      } else {
        setErrors({ ...errors, password: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    setErrors({
      email: "",
      password: "",
    });

    e.preventDefault();
    if (errors.email | errors.password | !formData.email | !formData.password) {
      return;
    }

    try {
      const userExists = await checkEmail(formData.email);
      if (!userExists) {
        setErrors({ ...errors, email: "Email doesnt exist" });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      return alert("Something went wrong");
    }

    try {
      var encryptedFormData = await encryptAuthBody(formData);
    } catch (error) {
      setIsLoading(false);
      return alert("Something went wrong");
    }

    let res;
    try {
      res = await axios.post(API.auth.login, {
        data: encryptedFormData,
      });
      setIsLoading(false);
      if (!res.data.success) {
        setErrors({ ...errors, password: res.data.error });
        return;
      }
      login(res.data.user);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      return alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={
            errors.email ||
            errors.password ||
            !formData.email ||
            !formData.password
          }
        >
          {isLoading ? <Loader isLoading={true} /> : "Login"}
        </button>

        <p className="signup-link">
          Don't have an account? <Link to="/auth/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
