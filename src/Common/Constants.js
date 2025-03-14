import AXIOS from "axios";
const URI = "http://localhost:8000";

export const API = {
  auth: {
    getServerPublicKey: `/auth/public_key/`,
    signup: `/auth/signup/`,
    login: `/auth/login/`,
    logout: "/auth/logout/",
    checkEmailAvailability: "/auth/email_check/",
  },
};

export const axios = AXIOS.create({
  baseURL: URI,
  withCredentials: true,
});
