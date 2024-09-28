from llm_client import query_llm

# Call the function to query the model
result = query_llm("tell me about the history of india", max_length=500, temperature=0.2)

# Print the result
print(result)
