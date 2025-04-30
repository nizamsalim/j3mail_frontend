import React from "react";
import "./Inbox.css";
import MailList from "./MailList";
import { Outlet } from "react-router-dom";
import { useMailList } from "../../Common/MailListContext";

const Inbox = () => {
  const { placeholder, setPlaceholder } = useMailList();

  return (
    <div className="email-system">
      <MailList setPlaceholder={setPlaceholder} />
      {placeholder && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
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
