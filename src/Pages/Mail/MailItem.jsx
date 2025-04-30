/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import "./Inbox.css";
import { useNavigate, useParams } from "react-router-dom";
import { API, axios } from "../../Common/Constants";
import { useMailList } from "../../Common/MailListContext";
import { decryptMail } from "../../Helpers/Mail/MailCipher";
import Loader from "../../Components/Loader";
import { useAuth } from "../../Common/AuthContext";

const MailItem = () => {
  const { mailId } = useParams();
  const { user } = useAuth();
  const { list, setList, setPlaceholder } = useMailList();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    axios.get(`${API.mail.readMail}${mailId}`).then((res) => {
      if (!res.data.success) {
        console.log(res.data.error);
        return alert("Something went wrong");
      }
      console.log(res.data.mail);
      setMail(res.data.mail);
      setList(list);
    });

    return () => {
      setIsDecrypted(false);
    };
  }, [mailId]);

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setList("inbox");
        setIsDecrypted(false);
        setPlaceholder(true);
        nav("/mail");
      }
    });

    return () => {};
  }, []);

  useEffect(() => {
    return () => {
      setMail({
        mail: {
          to: "",
          from: "",
          es: "",
          eb: "",
          ea: "",
        },
      });
    };
  }, [list]);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [mail, setMail] = useState({
    mail: {
      to: "",
      from: "",
      es: "",
      eb: "",
      ea: "",
    },
  });

  const handleDecrypt = async () => {
    setIsLoading(true);
    const decryptedMail = await decryptMail(mail);
    setIsVerified(decryptedMail.verified);
    setSubject(decryptedMail.subject);
    setBody(decryptedMail.body);
    setIsLoading(false);
    setIsDecrypted(true);
  };
  return (
    <div className="email-details">
      <h3 className="text">
        {isDecrypted && isVerified ? subject : mail.mail.es}
      </h3>
      <p className="text">
        <strong>{list === "inbox" ? "From: " : "To: "}</strong>
        {list === "inbox" ? mail.mail.from : mail.mail.to}
      </p>
      {isDecrypted &&
        (isVerified ? (
          <p style={{ color: "darkgreen", marginTop: "20px" }}>
            <strong> Email signature verified </strong>
          </p>
        ) : (
          <p style={{ color: "red", marginTop: "20px" }}>
            <strong> Email signature not verified. Message is tampered </strong>
          </p>
        ))}

      <div className="email-body text">
        {isDecrypted && isVerified ? body : mail.mail.eb}
      </div>
      {user.email === mail.mail.to && (
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button
            className="attach-btn"
            style={{
              marginTop: "20px",
              padding: "5px",
              backgroundColor: `${isDecrypted ? "grey" : "green"}`,
            }}
            onClick={handleDecrypt}
            disabled={list === "inbox" && isDecrypted}
          >
            {isLoading ? <Loader isLoading={isLoading} /> : "Decrypt"}
          </button>
        </div>
      )}
    </div>
  );
};
export default MailItem;
