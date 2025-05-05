// frontend/src/components/JobTextArea.js
import React from 'react';
import './JobTextArea.css';

function JobTextArea({ value, onChange }) {
  return (
    <div className="job-textarea-wrapper">
      <label htmlFor="jobDescription" className="job-textarea-label">
        Paste Job Description:
      </label>
      <textarea
        id="jobDescription"
        name="jobDescription"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description text here..."
        required
        rows={10}
        className="job-textarea"
      />
    </div>
  );
}

export default JobTextArea;
