import React, { useEffect, useState } from "react";
import "./Inbox.css";
import { useNavigate } from "react-router-dom";
import { API, axios } from "../../Common/Constants";
import { useMailList } from "../../Common/MailListContext";

const MailList = ({ setPlaceholder }) => {
  const [mails, setMails] = useState([]);
  const { list, setList } = useMailList();
  const nav = useNavigate();

  const populate = async (l) => {
    const res = await axios.get(
      l === "inbox" ? API.mail.getInbox : API.mail.getOutBox
    );
    setMails(res.data.mails);
  };

  useEffect(() => {
    populate(list);
    return () => {};
  }, [list]);

  return (
    <div className="email-list">
      <button
        className="compose-btn"
        onClick={() => {
          nav("/");
          // setPlaceholder(false);
        }}
        style={{ width: "20%", padding: "0px" }}
      >
        Home
      </button>
      <button
        className="compose-btn"
        onClick={() => {
          nav("/mail/compose");
          setPlaceholder(false);
        }}
      >
        Compose
      </button>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          className={`compose-btn w-50 ${
            list === "inbox" ? "list-select" : ""
          }`}
          onClick={async () => {
            setList("inbox");
            list !== "inbox" && setMails([]);
            populate("inbox");
            setPlaceholder(true);
            nav("/mail");
          }}
        >
          Inbox
        </button>
        <button
          className={`compose-btn w-50 ${
            list === "outbox" ? "list-select" : ""
          }`}
          onClick={async () => {
            setList("outbox");
            list !== "outbox" && setMails([]);
            populate("outbox");
            setPlaceholder(true);
            nav("/mail");
          }}
        >
          Outbox
        </button>
      </div>
      <div className="email-list-scroll">
        {mails.length === 0 && (
          <p style={{ textAlign: "center" }}>No mails yet</p>
        )}
        {mails.map((mail, ind) => (
          <div
            key={ind}
            id={ind}
            className={`email-item ${
              mail.meta.isUnread && list === "inbox" ? "selected" : ""
            } `}
            onClick={(e) => {
              setPlaceholder(false);
              document.getElementById(ind).classList.remove("selected");
              nav(`/mail/read/${mail._id}`);
            }}
          >
            <p style={{ marginTop: "0px", textAlign: "end" }}>
              {mail.meta.date} | {mail.meta.time}
            </p>
            <p>{list === "inbox" ? "From:" : "To:"}</p>
            <p style={{ fontSize: "17px" }}>
              {list === "inbox" ? mail.mail.from : mail.mail.to}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MailList;
