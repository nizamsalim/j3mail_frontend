import crypto from "node-forge";
import { getClientPrivateKey, getPublicKey } from "../Key/KeyHandler";

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

  const recPublicKeyPem = await getPublicKey(to);
  const recPublicKey = crypto.pki.publicKeyFromPem(recPublicKeyPem);
  const encryptedAESKey = recPublicKey.encrypt(aesKey, "RSA-OAEP");

  const mailSignature = await signMail(subject + body);

  return {
    mail: encryptedMail,
    session: {
      key: crypto.util.encode64(encryptedAESKey),
      iv: crypto.util.encode64(iv),
      signature: mailSignature,
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

  const verified = await verifyMail(
    decryptedSubject + decryptedBody,
    session.signature,
    mail.from
  );

  return {
    verified,
    subject: decryptedSubject,
    body: decryptedBody,
  };
};

export const signMail = async (data) => {
  const privateKeyPem = await getClientPrivateKey();
  const digest = crypto.md.sha256.create();
  digest.update(data, "utf8");
  const privateKey = crypto.pki.privateKeyFromPem(privateKeyPem);
  const signature = privateKey.sign(digest);
  return crypto.util.encode64(signature);
};

export const verifyMail = async (data, signature, from) => {
  const publicKeyPem = await getPublicKey(from);
  const digest = crypto.md.sha256.create();
  digest.update(data, "utf8");
  const publicKey = crypto.pki.publicKeyFromPem(publicKeyPem);
  const verified = publicKey.verify(
    digest.digest().bytes(),
    crypto.util.decode64(signature)
  );
  return verified;
};
