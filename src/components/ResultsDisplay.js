// frontend/src/components/ResultsDisplay.js
import React from 'react';
import './ResultsDisplay.css'; // Import component-specific styles

// Updated props: receive rating, suggestions, initial text for ATS view,
// editable state + setter for editor, reanalyze handler, loading state.
function ResultsDisplay({
    rating,
    suggestions,
    initialResumeText, // The full text from the initial analysis
    editableResumeText, // The current state of the text editor
    setEditableResumeText, // Function to update the editor state
    onReanalyze, // Function to trigger re-analysis (using edited text)
    isLoading // Loading state to disable reanalyze button
}) {

    // Determine rating color dynamically
    const getRatingColor = (r) => {
        if (r === null || r === undefined) return '#888'; // Default grey
        if (r < 40) return '#e74c3c'; // Red
        if (r < 75) return '#f39c12'; // Orange
        return '#2ecc71'; // Green
    };

    return (
        // Add a container class for easier styling from ResultsDisplay.css
        <div className="results-display-container">

            {/* Rating Display (integrated here) */}
            <div className="score-display card-section"> {/* Added card-section class */}
                <h3>Resume Score</h3>
                <p className="score-value" style={{ color: getRatingColor(rating) }}>
                    {rating ?? 'N/A'}%
                </p>
                {rating >= 75 && <p className="score-status" style={{ color: getRatingColor(rating) }}>Ready to Apply!</p>}
                {rating < 75 && rating !== null && <p className="score-status" style={{ color: getRatingColor(rating) }}>Needs Improvement</p>}
            </div>

            {/* Editor Section (Suggestions + Edit Box) */}
            <div className="editor-section"> {/* This div controls the flex/grid layout */}
                <div className="suggestions-box card-section"> {/* Added card-section class */}
                    <h3>Suggestions:</h3>
                    {/* Use optional chaining and check length */}
                    {suggestions?.length > 0 ? (
                        <ul className="suggestions-list">
                            {/* Ensure suggestions are strings before rendering */}
                            {suggestions.map((s, i) => (
                                <li key={i}>{typeof s === 'string' ? s : JSON.stringify(s)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-suggestions">No specific suggestions available. Review the job description for keywords.</p>
                    )}
                </div>

                <div className="resume-edit-box card-section"> {/* Added card-section class */}
                    <h3>Edit Resume:</h3>
                    <textarea
                        value={editableResumeText} // Use the state passed from App.js
                        onChange={(e) => setEditableResumeText(e.target.value)} // Update state in App.js
                        rows={20} // Increase default rows
                        placeholder="Edit your resume text here..."
                        className="resume-editor"
                        aria-label="Resume Editor" // Accessibility
                    />
                </div>
            </div>

            {/* Reanalyze Button */}
            {/* This button now triggers re-analysis based on the *edited* text */}
            <div className="reanalyze-button-container">
                <button
                    className="button reanalyze" // Use specific class
                    onClick={onReanalyze} // Calls handleReanalyzeEdited in App.js
                    disabled={isLoading} // Disable while loading
                >
                    {isLoading ? "Analyzing..." : "Re-analyze Edited Resume"}
                </button>
                <p className="reanalyze-note">Re-analyzes the text currently in the editor above.</p>
            </div>

            {/* ATS View Section */}
            <div className="ats-output-box card-section"> {/* Added card-section class */}
                <h3>ATS View (Simplified Text Extraction)</h3>
                <p className="ats-note">This shows the plain text extracted from your resume, similar to what an ATS might initially parse. Formatting is removed.</p>
                {/* Display the *initial* full text, not the editable one */}
                <pre className="ats-output">{initialResumeText || 'No resume text available.'}</pre>
            </div>

            {/* Removed redundant "Use Different Resume" button - handled in App.js */}

        </div>
    );
}

export default ResultsDisplay;