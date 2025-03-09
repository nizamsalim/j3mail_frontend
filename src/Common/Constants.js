import AXIOS from "axios";
const URI = "http://localhost:5000";

export const API = {
  auth: {
    getServerPublicKey: `/auth/key`,
    signup: `/auth/signup`,
    login: `/auth/login`,
    logout: "/auth/logout",
    checkEmailAvailability: "/auth/emailcheck",
  },
};

export const axios = AXIOS.create({
  baseURL: URI,
  withCredentials: true,
});
