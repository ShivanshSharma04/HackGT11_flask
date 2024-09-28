import React, { useState } from 'react';
import './App.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function App() {
  const [patients, setPatients] = useState([
    { rank: 1, name: 'John Doe', symptoms: 'Headache, dizziness', diagnosis: 'Migraine, ...', severity: 5 },
    { rank: 2, name: 'Jane Doe', symptoms: 'Fever, cough', diagnosis: 'Flu, ...', severity: 3 }
  ]);

  const [newPatient, setNewPatient] = useState({ name: '', symptoms: '', diagnosis: '', severity: 0 });
  const [insertPosition, setInsertPosition] = useState(patients.length + 1);
  const [lastInsertedRank, setLastInsertedRank] = useState(null);  // To track the last inserted patient

  // Add a new patient at the chosen position
  const addPatient = () => {
    const updatedPatients = [...patients];
    const newRank = insertPosition > patients.length ? patients.length + 1 : insertPosition;

    // Insert the new patient at the specified position
    updatedPatients.splice(newRank - 1, 0, { rank: newRank, ...newPatient });

    // Update ranks of other patients after the inserted one
    for (let i = newRank; i < updatedPatients.length; i++) {
      updatedPatients[i].rank = i + 1;
    }

    setPatients(updatedPatients);
    setNewPatient({ name: '', symptoms: '', diagnosis: '', severity: 0 });
    setInsertPosition(patients.length + 2);

    // Track the rank of the newly inserted patient
    setLastInsertedRank(newRank);
  };

  // Delete a patient based on rank
  const deletePatient = (rank) => {
    const updatedPatients = patients.filter(patient => patient.rank !== rank);

    // Update ranks for remaining patients
    updatedPatients.forEach((patient, index) => {
      patient.rank = index + 1;
    });

    setPatients(updatedPatients);
  };

  return (
    <div className="app-container">
      <h1 className="title purple-title">Queue of Patients</h1>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symptoms</th>
            <th>Potential Diagnoses</th>
            <th>Perceived Severity</th>
            <th>Treated</th>  {/* Added Action column for the cross mark */}
          </tr>
        </thead>
        <TransitionGroup component="tbody">
          {patients.map((patient) => (
            <CSSTransition
              key={patient.rank}
              timeout={700}
              classNames="bubble-up"
              onEntered={() => setLastInsertedRank(null)}  // Reset highlight after animation completes
            >
              <tr className={patient.rank === lastInsertedRank ? 'highlight' : ''}>
                <td>{patient.rank}</td>
                <td>{patient.name}</td>
                <td>{patient.symptoms}</td>
                <td>{patient.diagnosis}</td>
                <td>{patient.severity}</td>
                <td>
                  {/* Delete button (cross mark) for each row */}
                  <button onClick={() => deletePatient(patient.rank)} className="delete-button">
                    &#x2715;
                  </button>
                </td>
              </tr>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </table>

      <div className="add-patient-form">
        <h3>Add New Patient (Testing)</h3>
        <input
          type="text"
          placeholder="Name"
          value={newPatient.name}
          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
          className="input-box"
        />
        <input
          type="text"
          placeholder="Symptoms"
          value={newPatient.symptoms}
          onChange={(e) => setNewPatient({ ...newPatient, symptoms: e.target.value })}
          className="input-box"
        />
        <input
          type="text"
          placeholder="Potential Diagnoses"
          value={newPatient.diagnosis}
          onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
          className="input-box"
        />
        <input
          type="number"
          placeholder="Perceived Severity (1-10)"
          value={newPatient.severity}
          min="1"
          max="10"
          onChange={(e) => setNewPatient({ ...newPatient, severity: Number(e.target.value) })}
          className="input-box"
        />

        {/* Input to choose where to insert the new patient */}
        <input
          type="number"
          placeholder={`Insert at position (1-${patients.length + 1})`}
          value={insertPosition}
          min="1"
          max={patients.length + 1}
          onChange={(e) => setInsertPosition(Number(e.target.value))}
          className="input-box"
        />

        <button onClick={addPatient} className="submit-button">Add Patient</button>
      </div>
    </div>
  );
}

export default App;
