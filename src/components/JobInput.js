// src/components/JobInput.js
import React from 'react';

function JobInput({ value, onChange }) {
  return (
    <div>
      <label htmlFor="jobUrl">Job Description URL:</label>
      <input
        type="url"
        id="jobUrl"
        name="jobUrl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.linkedin.com/jobs/view/..."
        required
        style={{ width: '300px' }}
      />
    </div>
  );
}

export default JobInput;