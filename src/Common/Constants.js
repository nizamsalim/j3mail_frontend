import AXIOS from "axios";
const URI = "http://localhost:8000";

export const API = {
  auth: {
    signup: `/auth/signup/`,
    login: `/auth/login/`,
    logout: "/auth/logout/",
    checkEmailAvailability: "/auth/email_check/",
  },
  key: {
    getServerPublicKey: `/auth/public_key/`, // get
    getPublicKey: "/auth/public_key/", //post
    getClientPrivateKey: "/auth/private_key/", // get
    setClientKeyPair: "/auth/private_key/", // post
  },
  mail: {
    sendMail: "/mail/send/",
    getInbox: "/mail/list/?list=inbox",
    getOutBox: "/mail/list/?list=outbox",
    readMail: "/mail/read/?id=",
  },
};

export const axios = AXIOS.create({
  baseURL: URI,
  withCredentials: true,
});
