import os
import openai
openai.api_type = "azure"
openai.api_base = "https://aiatl-group-2.openai.azure.com/"
openai.api_version = "2023-09-15-preview"
openai.api_key = "211703b324ce43bf87805cceb4105cb2"


message_text = [{"role":"system","content":"You are an AI assistant that helps people find information."}]

completion = openai.ChatCompletion.create(
  engine="gpt-35-turbo",
  messages = message_text,
  temperature=0.7,
  max_tokens=800,
  top_p=0.95,
  frequency_penalty=0,
  presence_penalty=0,
  stop=None
)

print(completion)