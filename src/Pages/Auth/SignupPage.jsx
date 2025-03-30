import React, { useState } from "react";
import "./SignupPage.css";
import { Link, useNavigate } from "react-router-dom";
import { encryptAuthBody } from "../../Helpers/Auth/AuthCipher";
import { API, axios } from "../../Common/Constants";
import { useAuth } from "../../Common/AuthContext";
import Loader from "../../Components/Loader";
import { checkEmail } from "../../Helpers/Auth/CheckEmail";
import { generateClientRSAKeyPair } from "../../Helpers/Key/KeyHandler";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
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

    // Validate name (should not be empty)
    if (name === "name") {
      setErrors({
        ...errors,
        name: value.trim() === "" ? "Please enter your name" : "",
      });
    }

    // Validate email format
    if (name === "email") {
      setErrors({
        ...errors,
        email: !validateEmail(value)
          ? "Please enter valid email: (abc@j3mail.com)"
          : "",
      });
    }

    // Validate password length
    if (name === "password") {
      setErrors({
        ...errors,
        password:
          value.length < 6 ? "Password must be at least 6 characters" : "",
      });
    }
  };

  const handleSubmit = async (e) => {
    setErrors({
      email: "",
      password: "",
      name: "",
    });
    setIsLoading(true);
    e.preventDefault();
    if (
      errors.name |
      errors.email |
      errors.password |
      !formData.name |
      !formData.email |
      !formData.password
    ) {
      return;
    }

    try {
      const userExists = await checkEmail(formData.email);
      if (userExists) {
        setErrors({ ...errors, email: "Email already exists" });
        setIsLoading(false);

        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return alert("Something went wrong");
    }

    try {
      var encryptedFormData = await encryptAuthBody(formData);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return alert("Something went wrong");
    }
    let res;
    try {
      res = await axios.post(API.auth.signup, {
        data: encryptedFormData,
      });
      if (!res.data.success) {
        setIsLoading(false);
        console.log(res.data.error);
        return alert("Something went wrong");
      }
      const user = res.data.user;
      const keyPair = generateClientRSAKeyPair(formData.password); // {publicKey,E(privateKey)}

      res = await axios.post(API.key.setClientKeyPair, keyPair);
      if (!res.data.success) {
        setIsLoading(false);
        console.log(res.data.error);
        return alert("RSA pvt key");
      }
      setIsLoading(false);
      login(user);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      return alert("Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="johndoe@j3mail.com"
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
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="signup-btn"
          disabled={
            errors.name ||
            errors.email ||
            errors.password ||
            !formData.name ||
            !formData.email ||
            !formData.password
          }
        >
          {isLoading ? <Loader isLoading={true} /> : "Signup"}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
