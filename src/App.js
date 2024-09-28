import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Use state hooks to manage form input values
  const [name, setName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    // Prepare the data to be sent to the API
    const data = {
      name: name,
      symptoms: symptoms,
      age: age,
      gender: gender
    };

    try {
      // Send POST request to the Flask API
      const res = await axios.post('https://hackgt11flask-production.up.railway.app/triage', data);
      setResponse(res.data); // Save the API response to display it
      console.log("Response from API:", res.data);
    } catch (error) {
      console.error("There was an error sending the request:", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Medi-Sched</h1> {/* Title */}
      
      <div className="name-container">
        <h3>Your Name</h3>
        <input
          type="text"
          placeholder="Enter your name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}  // Update name state
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
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}  // Update symptoms state
          className="input-box"
        />
      </div>
      
      <div className="extra-inputs">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your age..."
            value={age}
            onChange={(e) => setAge(e.target.value)}  // Update age state
            className="input-box"
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your gender..."
            value={gender}
            onChange={(e) => setGender(e.target.value)}  // Update gender state
            className="input-box"
          />
        </div>
      </div>
      
      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Submit</button> {/* Submit Button */}
      </div>

      {/* Display response from API */}
      {response && (
        <div className="response-container">
          <h3>Response from Triage API:</h3>
          <p>Severity Rating: {response.severity_rating}</p>
          <p>Potential Diagnoses: {response.potential_diagnoses.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
