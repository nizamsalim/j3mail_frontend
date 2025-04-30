/* eslint-disable no-unused-vars */
import crypto from "node-forge";
import { Buffer } from "buffer";
import { getClientPrivateKey, getRecieverPublicKey } from "../Key/KeyHandler";

const encryptText = (text, aesKey, iv) => {
  const cipher = crypto.cipher.createCipher("AES-GCM", aesKey);
  cipher.start({ iv });
  cipher.update(crypto.util.createBuffer(text));
  cipher.finish();
  const output = cipher.output.bytes();
  const tag = cipher.mode.tag.bytes(); // hex: 32 b64: 24
  // console.log("length: " + crypto.util.encode64(tag).length);
  const encryptedHex = crypto.util.encode64(output) + crypto.util.encode64(tag);
  return encryptedHex;
};

export const test = (mail) => {
  const { to, body, subject } = mail;
  const aesKey = crypto.random.getBytes(32);
  const iv = crypto.random.getBytes(12);
  const encryptedHex = encryptText(subject, aesKey, iv);
  console.log({ encryptedHex });
  const decrypted = decryptText(encryptedHex, aesKey, iv);
  console.log({ decrypted });
};

const decryptText = (text, aesKey, iv) => {
  const cipherTextHex = text.slice(0, -24);
  const tagHex = text.slice(-24);

  const cipher = crypto.cipher.createDecipher("AES-GCM", aesKey);
  cipher.start({
    iv,
    tag: crypto.util.createBuffer(crypto.util.decode64(tagHex)),
  });
  cipher.update(crypto.util.createBuffer(crypto.util.decode64(cipherTextHex)));
  cipher.finish();
  const output = cipher.output.toString();
  return output;
};

const encryptAttachment = async (attachment, aesKey, iv) => {
  const arrayBuffer = await attachment.arrayBuffer();
  const output = encryptText(arrayBuffer, aesKey, iv);
  return output;
};

export const encryptMail = async (mail, attachment) => {
  const { to, subject, body } = mail;

  const aesKey = crypto.random.getBytesSync(32);
  const iv = crypto.random.getBytesSync(12);

  const encryptedSubject = encryptText(subject, aesKey, iv);
  const encryptedBody = encryptText(body, aesKey, iv);
  const encryptedAttachment = attachment
    ? await encryptAttachment(attachment, aesKey, iv)
    : null;
  const encryptedMail = {
    to,
    es: encryptedSubject,
    eb: encryptedBody,
    ea: encryptedAttachment,
  };
  if (encryptedMail.ea == null) {
    delete encryptedMail.ea;
  }

  const recPublicKeyPem = await getRecieverPublicKey(to);
  const recPublicKey = crypto.pki.publicKeyFromPem(recPublicKeyPem);
  const encryptedAESKey = recPublicKey.encrypt(aesKey, "RSA-OAEP");

  return {
    mail: encryptedMail,
    session: {
      key: crypto.util.encode64(encryptedAESKey),
      iv: crypto.util.encode64(iv),
    },
  };
};

export const decryptMail = async (data) => {
  const { mail, session } = data;
  const clientPrivateKeyPem = await getClientPrivateKey();
  const privateKey = crypto.pki.privateKeyFromPem(clientPrivateKeyPem);
  const aesKeyBytes = privateKey.decrypt(
    crypto.util.decode64(session.key),
    "RSA-OAEP"
  );
  const ivBytes = crypto.util.decode64(session.iv);

  const decryptedSubject = decryptText(mail.es, aesKeyBytes, ivBytes);
  const decryptedBody = decryptText(mail.eb, aesKeyBytes, ivBytes);
  return {
    subject: decryptedSubject,
    body: decryptedBody,
  };
};

export const signMail = (encryptedMail)=>{

}

export const verifyMail = (data)=>{

}
