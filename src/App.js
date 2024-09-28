import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1 className="title">Medi-Sched</h1> {/* Title */}
      
      <div className="name-container"> {/* Updated to name-container */}
        <h3>Your Name</h3>
        <input
          type="text"
          placeholder="Enter your name here..."
          className="input-box"
        />
      </div>
      
      <div className="symptom-prompt">
        <h2>Details About Your Visit</h2>
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
        <button className="submit-button">Submit</button> {/* Submit Button */}
      </div>
    </div>
  );
}

export default App;
