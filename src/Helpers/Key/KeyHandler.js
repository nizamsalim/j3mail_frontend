import { API, axios } from "../../Common/Constants";
import crypto from "node-forge";

const PASSWORD = process.env.REACT_APP_SECRET_PASSWORD;

export const generateClientRSAKeyPair = () => {
  const keyPair = crypto.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKey = crypto.pki.publicKeyToRSAPublicKeyPem(keyPair.publicKey);
  const privateKey = keyPair.privateKey;

  const encryptedPrivateKey = crypto.pki.encryptRsaPrivateKey(
    privateKey,
    PASSWORD
  );

  return {
    publicKey,
    privateKey: encryptedPrivateKey,
  };
};

export const getClientPrivateKey = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(API.key.getClientPrivateKey);
      if (!res.data.success) {
        reject(res.data.error);
      }
      const encryptedPrivateKey = res.data.private_key;
      const decryptedPrivateKey = crypto.pki.decryptRsaPrivateKey(
        encryptedPrivateKey,
        PASSWORD
      );
      resolve(crypto.pki.privateKeyToPem(decryptedPrivateKey));
    } catch (error) {
      reject();
    }
  });
};

export const getRecieverPublicKey = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(API.key.getRecieverPublicKey, { email });
      if (!res.data.success) {
        reject();
      }
      resolve(res.data.public_key);
    } catch (error) {
      reject();
    }
  });
};

export const getServerPublicKey = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(API.key.getServerPublicKey);
      if (!res.data.success) {
        reject(res.data.error);
      }
      resolve(res.data.public_key);
    } catch (error) {
      reject(error);
    }
  });
};
