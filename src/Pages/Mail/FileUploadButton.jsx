import React, { useRef } from "react";
import "./Inbox.css";
const FileUploadButton = ({ attachment, setAttachment }) => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger click on the hidden file input when the button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.split(".")[1] !== "pdf") {
        return alert("Only PDF files are allowed");
      }
      setAttachment(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachment(null);
    // Reset the file input value to allow re-uploading the same file if needed
    fileInputRef.current.value = "";
  };

  return (
    <div className="file-upload-container">
      <button className="attach-btn" onClick={handleButtonClick}>
        Attach File
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="application/pdf"
      />
      {attachment && (
        <div className="file-info">
          <span className="file-name">{attachment.name}</span>
          <span className="file-size">
            ({(attachment.size / 1024).toFixed(2)} KB)
          </span>
          <button className="remove-btn" onClick={handleRemoveFile}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton;
