import React, { useState } from "react";
import "./Inbox.css";
import FileUploadButton from "./FileUploadButton";
import { checkEmail } from "../../Helpers/Auth/CheckEmail";
import { encryptMail } from "../../Helpers/Mail/MailCipher";
import Loader from "../../Components/Loader";
import { API, axios } from "../../Common/Constants";
import { useNavigate } from "react-router-dom";
import { useMailList } from "../../Common/MailListContext";

const ComposeMail = () => {
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [emailError, setEmailError] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();
  const { setList } = useMailList();

  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@j3mail\.com$/.test(email);
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    const updatedComposeData = { ...composeData, [name]: value };
    setComposeData(updatedComposeData);
  };

  const handleSendMail = async () => {
    setEmailError(false);
    setIsLoading(true);
    try {
      let emailValid = validateEmail(composeData.to);
      if (!emailValid) {
        setIsLoading(false);
        setEmailError("Email must be of the format abc@j3mail.com");
        return;
      }
      // console.log("flag");
      emailValid = await checkEmail(composeData.to);
      // console.log(emailValid)
      if (!emailValid) {
        setIsLoading(false);
        setEmailError(`Email ${composeData.to} does not exist`);
        return;
      }
      const encryptedMail = await encryptMail(composeData, attachment);

      const res = await axios.post(API.mail.sendMail, encryptedMail);
      setIsLoading(false);
      if (!res.data.success) {
        console.log(res.data.error);
        return alert("Something went wrong");
      }
      setList("outbox");
      nav("/mail");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      alert("Something went wrong");
    }
    // onClose();
  };

  return (
    <div className="">
      <div className="compose-mail">
        <h3>Compose Mail</h3>
        <input
          type="email"
          name="to"
          placeholder="To (example@j3mail.com)"
          value={composeData.to}
          onChange={handleComposeChange}
          className={emailError && composeData.to ? "invalid" : ""}
          required
        />
        {emailError ? <p className="error-text">{emailError}</p> : <p></p>}
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={composeData.subject}
          onChange={handleComposeChange}
          required
        />
        <textarea
          name="body"
          placeholder="Body"
          value={composeData.body}
          onChange={handleComposeChange}
          required
          rows={50}
        />
        <FileUploadButton
          attachment={attachment}
          setAttachment={setAttachment}
        />
        <button
          onClick={handleSendMail}
          className="send-btn"
          disabled={
            !(
              composeData.to.trim() !== "" &&
              composeData.subject.trim() !== "" &&
              composeData.body.trim() !== ""
            )
          }
        >
          {isLoading ? <Loader isLoading={isLoading} /> : "Send mail"}
        </button>
      </div>
    </div>
  );
};

export default ComposeMail;
