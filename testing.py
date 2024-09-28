from llm_client import query_llm

# Call the function to query the model
result = query_llm("""Symptoms: Lost feeling in right arm, dizziness

    Provide the following:
    1. A severity rating from 1 to 10 for the condition.
    2. The top 3 most likely diagnoses.

    Respond in this exact format:
    "Severity rating: X. Potential diagnoses: diagnosis1, diagnosis2, diagnosis3""", max_length=500, temperature=0.2)

# Print the result
print("result: ",result)

"""
curl -X GET http://127.0.0.1:5000/queue -H "Content-Type: application/json"

curl -X POST http://127.0.0.1:5000/triage \
-H "Content-Type: application/json" \
-d '{
    "name": "Mary Beth",
    "symptoms": "Heart not beating, head impaled, multiple bullet wounds"
}'

curl -X POST http://127.0.0.1:5000/triage \                                
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "symptoms": "Lost feeling in right arm, dizziness"
}'


curl -X POST http://127.0.0.1:5000/triage \
-H "Content-Type: application/json" \
-d '{
    "name": "Mary Beth",
    "symptoms": "Heart not beating, head impaled, multiple bullet wounds"
}'

"""