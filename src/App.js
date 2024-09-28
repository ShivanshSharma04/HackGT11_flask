import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Medi-Sched</h1> {/* Added Title */}
      
      <div className="description-container">
        <h3>Description of you</h3>
        <input
          type="text"
          placeholder="Describe yourself here..."
          className="input-box"
        />
      </div>
      
      <div className="symptom-prompt">
        <h2>What are your symptoms?</h2>
      </div>
      
      <div className="input-container">
        <input
          type="text"
          placeholder="Describe your symptoms here..."
          className="input-box"
        />
      </div>
      
      <div className="extra-inputs">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your age..."
            className="input-box"
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your gender..."
            className="input-box"
          />
        </div>
      </div>
      
      <div className="submit-container">
        <button className="submit-button">Submit</button> {/* Single Submit Button */}
      </div>
    </div>
  );
}

export default App;
