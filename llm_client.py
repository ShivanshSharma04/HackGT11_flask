import requests
import time

# API key and model URL are defined here
API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
API_KEY = "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"

# Define the query function that sends a request to Hugging Face API
def query_llm(prompt, max_length=500, temperature=0.2, retries=5, delay=5):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_length": max_length,
            "temperature": temperature
        }
    }
    
    for attempt in range(retries):
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()

        if "error" in result:
            if "is currently loading" in result["error"]:
                print(f"Model is loading. Retrying in {delay} seconds... (Attempt {attempt + 1}/{retries})")
                time.sleep(delay)
            else:
                return result  # Return if there's an unhandled error
        else:
            # Extract and return only the generated text as a string
            if isinstance(result, list) and "generated_text" in result[0]:
                return result[0]["generated_text"]
            else:
                return result  # In case the response format is unexpected
    
    return "Error: Max retries reached. Model still loading."


# Example usage:
# result = query_llm("hello", max_length=500, temperature=0.2)
# print(result)
