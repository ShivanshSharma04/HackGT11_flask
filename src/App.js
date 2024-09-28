import React, { useState, useEffect } from 'react';
import './App.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import axios from 'axios';

function App() {
  const [patients, setPatients] = useState([]);
  const [lastInsertedId, setLastInsertedId] = useState(null); // Track the last inserted patient's ID
  const [removingId, setRemovingId] = useState(null); // Track the patient being removed

  // Poll the backend to get the updated patient queue every few seconds
  useEffect(() => {
    const fetchPatients = () => {
      axios.get('https://hackgt11flask-production.up.railway.app/queue')
        .then(response => {
          const updatedPatients = response.data;

          // Detect if there's a new patient (by comparing list lengths)
          if (patients.length < updatedPatients.length) {
            const newPatient = updatedPatients.find(
              newPatient => !patients.some(patient => patient.patient_id === newPatient.patient_id)
            );
            setLastInsertedId(newPatient.patient_id); // Set last inserted patient ID for green highlight
          }

          setPatients(updatedPatients); // Update patients state with new data
        })
        .catch(error => {
          console.error('Error fetching patient data:', error);
        });
    };

    // Poll every 5 seconds
    const interval = setInterval(fetchPatients, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [patients]);

  // Function to treat a patient (send patient_id to the backend)
  const treatPatient = (patientId) => {
    setRemovingId(patientId); // Set patient being removed for red animation
    setTimeout(() => {
      fetch('https://hackgt11flask-production.up.railway.app/treat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: patientId }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Patient treated successfully:', data);
          // Remove patient from the queue locally after treating
          setPatients(patients.filter(patient => patient.patient_id !== patientId));
          setRemovingId(null); // Reset removing state after animation
        })
        .catch((error) => {
          console.error('Error treating patient:', error);
        });
    }, 700); // Delay removal to allow red animation to finish
  };

  return (
    <div className="app-container">
      <h1 className="title purple-title">Medi-Sched - Queue of Patients</h1>

      <table className="patient-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symptoms</th>
            <th>Potential Diagnoses</th>
            <th>Severity</th>
            <th>Treated</th>  {/* Column for the Treat button */}
          </tr>
        </thead>
        <TransitionGroup component="tbody">
          {patients.map((patient, index) => (
            <CSSTransition
              key={patient.patient_id}
              timeout={700}
              classNames="bubble-up"
              onEntered={() => setLastInsertedId(null)} // Reset green highlight after animation
            >
              <tr
                className={
                  patient.patient_id === lastInsertedId
                    ? 'highlight'
                    : patient.patient_id === removingId
                    ? 'removing'
                    : ''
                }
              >
                <td>{index + 1}</td>
                <td>{patient.patient_name}</td>
                <td>{patient.symptoms}</td>
                <td>
                  {patient.potential_diagnoses.join(', ')}
                </td>
                <td>{patient.severity_rating}</td>
                <td>
                  <button
                    onClick={() => treatPatient(patient.patient_id)}
                    className="delete-button"
                  >
                    &#x2715;
                  </button>
                </td>
              </tr>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </table>
    </div>
  );
}

export default App;
