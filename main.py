from flask import Flask, request, jsonify
import re
import os
from flask_cors import CORS
from llm_client import query_llm  # Import the actual query_llm function

app = Flask(__name__)

# Initialize global patient_id and an empty list to serve as the queue
CORS(app)
patient_id_counter = 1
triage_queue = []


def parse_response(response: str):
    # Use regex to find all matches for the severity rating and diagnoses, then take the last one
    severity_matches = re.findall(r"Severity rating: (\d+)", response)
    diagnoses_matches = re.findall(r"Potential diagnoses: (.+)", response)
    
    # Get the last match for each
    severity_rating = int(severity_matches[-1]) if severity_matches else None
    diagnoses = diagnoses_matches[-1].split(', ') if diagnoses_matches else None
    
    return severity_rating, diagnoses


def insert_patient_in_queue(patient_data):
    """Inserts a patient into the queue sorted by severity rating."""
    severity = patient_data["severity_rating"]

    # Find the correct position to insert the new patient
    inserted = False
    for i, existing_patient in enumerate(triage_queue):
        if severity > existing_patient["severity_rating"]:
            triage_queue.insert(i, patient_data)
            inserted = True
            break

    # If the patient has the lowest severity, append them to the end
    if not inserted:
        triage_queue.append(patient_data)


@app.route('/triage', methods=['POST'])
def triage_patient():
    global patient_id_counter  # Use the global patient_id_counter
    """POST API to process patient symptoms and insert into the queue."""
    data = request.json
    patient_name = data.get("name")
    gender = data.get("gender", "Not specified")  # Optional, defaults to 'Not specified'
    age = data.get("age", "Not specified")  # Optional, defaults to 'Not specified'
    symptoms = data.get("symptoms")  # Combined symptoms and descriptions

    if not symptoms or not patient_name:
        return jsonify({"error": "Name and symptoms are required"}), 400

    # Construct the prompt for the LLM
    prompt = f"""
    Patient Information:
    Name: {patient_name}
    Gender: {gender}
    Age: {age}
    Symptoms: {symptoms}

    Provide the following:
    1. A severity rating from 1 to 10 for the condition.
    2. The top 3 most likely diagnoses.

    Respond in this exact format:
    "Severity rating: X. Potential diagnoses: diagnosis1(common name), diagnosis2(common name), diagnosis3(common name)"
    """

    try:
        # Call the actual LLM to get the response based on the symptoms
        gpt_output = query_llm(prompt)
        print("Generated Response:", gpt_output)

        # Parse the response to extract severity rating and diagnoses
        severity_rating, potential_diagnoses = parse_response(gpt_output)

        # Create the patient entry with severity rating and diagnoses
        patient_data = {
            "patient_id": patient_id_counter,  # Assign the current patient_id
            "patient_name": patient_name,
            "gender": gender,
            "age": age,
            "symptoms": symptoms,
            "severity_rating": severity_rating,
            "potential_diagnoses": potential_diagnoses
        }

        # Increment the patient_id for the next patient
        patient_id_counter += 1

        # Insert the patient into the queue at the proper position
        insert_patient_in_queue(patient_data)

        # Return the patient data
        return jsonify(patient_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/queue', methods=['GET'])
def get_queue():
    """GET API to retrieve the current triage queue."""
    return jsonify(triage_queue), 200


@app.route('/treat', methods=['POST'])
def treat_queue():
    """POST API to mark the patient with the given id as treated and remove them from the queue."""
    global triage_queue
    data = request.json

    # Check if 'patient_id' is in the request data
    if 'patient_id' not in data:
        return jsonify({"error": "patient_id is required"}), 400
    
    patient_id = data["patient_id"]
    
    # Search for the patient in the queue
    for i, patient in enumerate(triage_queue):
        if patient["patient_id"] == patient_id:
            triage_queue.pop(i)  # Remove the patient
            return jsonify({"message": "Patient treated and removed from queue", "queue": triage_queue}), 200
    
    # If patient is not found
    return jsonify({"error": "Patient not found"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
