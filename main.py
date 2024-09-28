from flask import Flask, request, jsonify
import openai
import os

app = Flask(__name__)

# Set your OpenAI API key directly
openai.api_key = "key"  # Replace with your actual OpenAI API key

# Initialize an empty list to serve as the queue
triage_queue = []

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
    """POST API to process patient symptoms and insert into the queue."""
    data = request.json
    patient_id = data.get("patient_id")
    symptoms = data.get("symptoms")
    
    if not symptoms:
        return jsonify({"error": "Symptoms are required"}), 400

    # Construct the prompt for GPT
    prompt = f"""
    You are an ER triage assistant. Given the following patient's description and symptoms, provide a rating from 1 to 10 for the severity of the condition, along with the top 3 most likely diagnoses.

    Symptoms: {symptoms}

    Respond ONLY with the following format and nothing else:
    "Severity rating: [integer]. Potential diagnoses: [diagnosis1, diagnosis2, diagnosis3]"
    """

    try:
        # Call the new OpenAI API (chat completion)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use appropriate model
            messages=[{"role": "system", "content": prompt}],
        )
        gpt_output = response['choices'][0]['message']['content'].strip()
        print("GPT Response:", gpt_output)

        # Process the GPT output to extract severity rating and diagnoses
        if "Severity rating:" not in gpt_output or "Potential diagnoses:" not in gpt_output:
            raise ValueError(f"GPT response does not contain expected format. Response: {gpt_output}")

        # Extract severity rating and diagnoses
        severity_rating_str = gpt_output.split("Severity rating:")[1].split(".")[0].strip()
        severity_rating = int(severity_rating_str)

        diagnoses_str = gpt_output.split("Potential diagnoses:")[1].strip()
        potential_diagnoses = diagnoses_str.split(", ")

        if len(potential_diagnoses) != 3:
            raise ValueError(f"GPT response does not contain exactly three diagnoses. Response: {gpt_output}")
        
        # Create the patient entry with severity rating and diagnoses
        patient_data = {
            "patient_id": patient_id,
            "symptoms": symptoms,
            "severity_rating": severity_rating,
            "potential_diagnoses": potential_diagnoses
        }

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

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
