// frontend/src/App.js
import React, { useState, useEffect } from "react"; // Added useEffect
import FileUpload from './components/FileUpload';
import JobTextArea from './components/JobTextArea';
import ResultsDisplay from './components/ResultsDisplay';
import "./App.css";

// Ensure API_URL is correctly set (using environment variable is good practice)
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function App() {
  // --- State Variables ---
  const [file, setFile] = useState(null); // The selected file object
  const [jobDescription, setJobDescription] = useState(""); // JD text
  const [analysisResult, setAnalysisResult] = useState(null); // Result from backend { rating, suggestions, fileId, fullResumeText, ... }
  const [editableResumeText, setEditableResumeText] = useState(''); // State for the text editor
  const [fileId, setFileId] = useState(null); // ID for downloads etc.
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(null); // Error state { message: '...', ... }

  // --- Helper Functions ---
  const showError = (message, details = {}) => {
    console.error("Error:", message, details); // Log errors for debugging
    setError({ message, ...details });
  };

  // --- Event Handlers ---
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setAnalysisResult(null); // Reset analysis when file changes
    setEditableResumeText(''); // Reset editor
    setError(null);
    setFileId(null);
  };

  const handleJDChange = (text) => {
    setJobDescription(text);
    // Optionally reset analysis when JD changes significantly
    // setAnalysisResult(null);
    // setEditableResumeText('');
    // setError(null);
    // setFileId(null);
  };

  // Handles the INITIAL analysis (File Upload)
  const handleInitialAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      return showError("Please provide both a resume file and job description.");
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results
    setEditableResumeText(''); // Clear editor
    setFileId(null);

    const formData = new FormData();
    formData.append("resumeFile", file);
    formData.append("jobDescriptionText", jobDescription);

    try {
      // Use fetch or axios (ensure consistency if using axios elsewhere)
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Pass backend error details if available
        throw new Error(result.error || `Server Error: ${response.status}`);
      }

      // **IMPORTANT**: Assume backend now returns full text as e.g., result.fullResumeText
      if (!result.fullResumeText) {
          console.warn("Backend response missing 'fullResumeText'. Editor/ATS view might be empty.");
      }

      setAnalysisResult(result);
      // Initialize the editor state with the full text from the result
      setEditableResumeText(result.fullResumeText || '');
      setFileId(result.fileId || null);

    } catch (err) {
       // Handle network errors vs application errors
       if (err instanceof TypeError) { // Network error likely
            showError("Network Error: Could not reach the server.", { name: err.name });
       } else {
            showError(err.message || "An unknown error occurred during analysis.", { name: err.name });
       }
    } finally {
      setLoading(false);
    }
  };

  // Handles RE-ANALYSIS using edited text (Requires NEW Backend Endpoint)
  const handleReanalyzeEdited = async () => {
    // Use the text from the editor state
    if (!editableResumeText.trim() || !jobDescription.trim()) {
      return showError("Cannot reanalyze without resume text and job description.");
    }

    setLoading(true);
    setError(null);
    // Don't clear analysisResult entirely, just update it

    // *** BACKEND CHANGE NEEDED ***
    // This requires a new backend endpoint (e.g., /reanalyze)
    // that accepts JSON data with the edited text.
    const payload = {
        resumeText: editableResumeText,
        jobDescriptionText: jobDescription // Send original JD back
        // Optionally send fileId if needed to link logs or something
    };

    try {
        const response = await fetch(`${API_URL}/reanalyze`, { // <-- NEW Endpoint
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json(); // Expecting { rating, suggestions } maybe

        if (!response.ok) {
            throw new Error(result.error || `Server Error: ${response.status}`);
        }

        // Update only the relevant parts of the analysis result
        setAnalysisResult(prevResult => ({
            ...prevResult, // Keep fileId, fullResumeText etc.
            rating: result.rating,
            suggestions: result.suggestions,
            // Add any other fields returned by /reanalyze
        }));

    } catch (err) {
         if (err instanceof TypeError) {
            showError("Network Error: Could not reach the server for re-analysis.", { name: err.name });
         } else {
            showError(err.message || "An unknown error occurred during re-analysis.", { name: err.name });
         }
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = () => {
    // Ensure analysisResult and rating exist before checking
    if (!fileId || !analysisResult?.rating) {
        return showError("Analysis not yet complete or rating missing.");
    }
    if (analysisResult.rating < 75) {
      return showError(`Download requires score ≥ 75% (Current: ${analysisResult.rating}%)`);
    }

    // Note: This downloads the ORIGINAL file uploaded via /upload
    // Downloading the *edited* text as a file would require more backend logic.
    window.location.href = `${API_URL}/download/${fileId}`;
  };

  // Resets the app to the initial state for a new resume/JD
  const handleUseDifferentResume = () => {
    setFile(null);
    setJobDescription("");
    setAnalysisResult(null);
    setEditableResumeText('');
    setFileId(null);
    setError(null);
    setLoading(false); // Ensure loading is reset
  };

  return (
    // Use className for consistency
    <div className="app-container">
      <h1>Resume Optimizer</h1> {/* Changed Title slightly */}

      {/* --- Initial Input Section (Card 1) --- */}
      {/* Show this card only when there are no results yet */}
      {!analysisResult && (
        <div className="card input-card">
          <h2>Enter Details</h2>
          <FileUpload onFileSelect={handleFileSelect} currentFile={file} />
          <JobTextArea value={jobDescription} onChange={handleJDChange} />

          <button
            className="button analyze" // Use specific class
            onClick={handleInitialAnalyze} // Use specific handler
            disabled={loading || !file || !jobDescription.trim()} // Disable if no file/JD
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          {/* Display input errors here */}
           {error && <div className="error-message">{error.message}</div>}
           {loading && !analysisResult && <div className="loading-indicator">Processing...</div>}
        </div>
      )}

      {/* --- Results Section (Card 2) --- */}
      {/* Show this card once results are available */}
      {analysisResult && (
        <div className="card results-card">
          {/* Pass necessary data and handlers to ResultsDisplay */}
          <ResultsDisplay
            // Key data points from analysis result
            rating={analysisResult.rating}
            suggestions={analysisResult.suggestions}
            initialResumeText={analysisResult.fullResumeText || ''} // Pass initial text for ATS view

            // State and handler for the editor
            editableResumeText={editableResumeText}
            setEditableResumeText={setEditableResumeText} // Pass setter down

            // Reanalyze handler (calls the function assuming new backend endpoint)
            onReanalyze={handleReanalyzeEdited}
            isLoading={loading} // Pass loading state for button disable
          />

          {/* Buttons related to the current analysis */}
          <div className="action-buttons-footer">
             <button
               className="button download"
               onClick={handleDownload}
               // Disable if score is too low OR if fileId is missing
               disabled={!fileId || analysisResult.rating < 75}
             >
                Download Original Resume {/* Clarified button text */}
             </button>

             <button
                className="button secondary" // Use specific class
                onClick={handleUseDifferentResume}
             >
                Analyze New Resume {/* Clarified button text */}
            </button>
          </div>
          {/* Display errors that occur during re-analysis or download */}
           {error && <div className="error-message">{error.message}</div>}
        </div>
      )}
    </div>
  );
}

export default App;