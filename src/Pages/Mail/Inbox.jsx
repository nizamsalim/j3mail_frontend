/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Inbox.css";
import MailList from "./MailList";
import ComposeMail from "./ComposeMail";
import MailItem from "./MailItem";
import { Outlet } from "react-router-dom";
import { useMailList } from "../../Common/MailListContext";

const emails = [
  {
    id: 1,
    sender: "alice@example.com",
    subject: "Meeting Reminder",
    content: "Don't forget about our meeting tomorrow at 10 AM.",
  },
  {
    id: 2,
    sender: "bob@example.com",
    subject: "Project Update",
    content: "The project is progressing well. We should be done by next week.",
  },
  {
    id: 3,
    sender: "charlie@example.com",
    subject: "Invoice Payment",
    content: "Please find attached the invoice for last month’s services.",
  },
  {
    id: 4,
    sender: "david@example.com",
    subject: "Weekend Plans",
    content: "Let's catch up this weekend! Let me know your availability.",
  },
];

const Inbox = () => {
  // const [selectedEmail, setSelectedEmail] = useState({ id: "" });
  const { placeholder, setPlaceholder } = useMailList();

  return (
    <div className="email-system">
      <MailList setPlaceholder={setPlaceholder} />
      {placeholder && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // width: "100%",
            margin: "auto",
          }}
        >
          <p className="placeholder-text">
            Select an email to view its content
          </p>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Inbox;
