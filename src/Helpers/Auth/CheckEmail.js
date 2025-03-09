import { API, axios } from "../../Common/Constants";

export const checkEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios.post(API.auth.checkEmailAvailability, {
        email,
      });
      if (!res.data.success) {
        reject("Something went wrong");
      }
      resolve(res.data.user_exists);
    } catch (error) {
      reject("Something went wrong");
    }
  });
};
