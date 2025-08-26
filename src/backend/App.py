from datetime import date, timedelta
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv


load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

model = genai.GenerativeModel("gemini-2.0-flash")

@app.route("/api/summarize", methods=["POST"])
def summarize():

    data = request.json
    journal_entries = data.get("journalList", [])
    entry_texts = "\n\n".join(journal_entries)

    if not journal_entries:
        return jsonify({"error": "No journal entry provided."}), 400

    try:
        prompt = f"""Take a look at the list of entry texts, and generate a summary from all of the entries that best highlights 
        the events that occurred over this series of texts:\n{entry_texts} response with JUST the summary, do not do any formatting address the user as "You"
        rather than "I". if theres not any entries, simply just leave the response as "not enough data"
        """
        response = model.generate_content(prompt)

        return jsonify({
            "summary": response.text.strip(),
        })

    except Exception as e:
        print("Gemini error:", e)
        return jsonify({"error": "Gemini API error."}), 500


@app.route("/api/chatting", methods=["POST"])
def chatting():

    data = request.json
    user_message = data.get("message", "").strip()
    tools = data.get("tools", [])
    entries = data.get("journalEntries", [])
    currentEntry = data.get("currentJournal")
    previousAIMessages = data.get("previousMessages", [])

    tool_prompt = "\n".join([
        f"Tool: {t['function']}\nDescription: {t['description']}\nParameters: {json.dumps(t['parameters'])}"
        for t in tools
    ])

    allJournalEntries = ""
    for entry in entries:
        allJournalEntries += f"Entry on {entry['date']} (Rating {entry['rating']}):\nTitle: {entry['title']}\nText: {entry['text']}\nID: {entry['id']}\n\n"

    full_prompt = f"""

You are an AI assistant that can call tools if needed.

Today's date is {date.today()} and tomorrow is {date.today() + timedelta(days=1)}. 
You may add or subtract days from today to come up with dates.

You are given all of the journal entries and their information here:
{allJournalEntries}

The current journal entry the user is looking at is {currentEntry}. 
Match this number to the ID of allJournalEntries to find the current journal entry. 
If currentEntry is 0, the user is not inside of a journal entry.

Here are the available tools:
{tool_prompt}

---

### Output format (VERY IMPORTANT):
You **must ALWAYS return valid JSON**. 
Never return plain text. Never include explanations, backticks, or code fences.  

There are only two allowed response shapes:

1. **If you are calling a tool:**
{{
  "type": "tool",
  "function": "function_name",
  "parameters": {{ ... }}
}}

2. **If no tool is needed (normal helpful message):**
{{
  "type": "message",
  "message": "your helpful text here"
}}

---

### Guidance
- If the user's message clearly matches a tool use case → use format (1).
- Otherwise, respond normally with format (2).
- If the user asks to change the entry text or entry rating but currentEntry == 0 → respond with (2) and tell them they must be inside an entry.
- If the user asks for a rating of the entry, you can generate a number 1–5 and use a tool to return the rating.
- For deleting entries: find the ID/title that matches best, but **confirm first** by sending back format (2) asking for confirmation. 
  (Check {previousAIMessages} to see if you already asked.)
- If unclear what the user means, respond with (2) saying you don’t understand.
- “What”/“How many” type questions usually → format (2), answered from {allJournalEntries}, not tools.
- Use a friendly tone consistent with the user’s message.

---

User: {user_message}
"""


    response = model.generate_content(full_prompt)
    
    try:
        parsed_json = json.loads(response.text)
        return jsonify(parsed_json)
    except Exception:
        return jsonify({"message": response.text})
    
    

if __name__ == "__main__":
    app.run(debug=True)

