import { API, axios } from "../../Common/Constants";
import crypto from "node-forge";

const getServerPublicKey = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(API.auth.getServerPublicKey);
      if (!res.data.success) {
        reject(res.data.error);
      }
      resolve(res.data.public_key);
    } catch (error) {
      reject(error);
    }
  });
};

export const encryptAuthBody = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const publicKeyPem = await getServerPublicKey();
      const publicKey = crypto.pki.publicKeyFromPem(publicKeyPem);
      const dataString = JSON.stringify(data);
      const encrypted = publicKey.encrypt(dataString, "RSA-OAEP");
      const encryptedBase64 = crypto.util.encode64(encrypted);
      resolve(encryptedBase64);
    } catch (error) {
      reject(error);
    }
  });
};
