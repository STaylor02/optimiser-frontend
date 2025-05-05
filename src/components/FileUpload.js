import React, { useState } from 'react';
import './FileUpload.css';

function FileUpload({ onFileSelect }) {
  const [fileName, setFileName] = useState('No file selected');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        onFileSelect(file); // calling the function passed from the parent
        setFileName(file.name);
      } else {
        alert('Please select a valid PDF or DOCX file.');
        event.target.value = null;
        onFileSelect(null); // resetting if invalid
        setFileName('Invalid file type');
      }
    } else {
      onFileSelect(null); // no file selected
      setFileName('No file selected');
    }
  };

  return (
    <div className="file-upload-wrapper">
      <label htmlFor="resumeFile" className="file-upload-label">
        Choose Resume (PDF/DOCX)
      </label>
      <input
        type="file"
        id="resumeFile"
        name="resumeFile"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="file-upload-input"
      />
      <span className="file-name-display">{fileName}</span>
    </div>
  );
}

export default FileUpload;
