import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="symptom-prompt">
        <h1>What are your symptoms?</h1>
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Describe your symptoms here..."
          className="symptom-input"
        />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
}

export default App;
