import crypto from "node-forge";
import { getServerPublicKey } from "../Key/KeyHandler";

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
