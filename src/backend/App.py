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


Here are the available tools:

{tool_prompt}

If the user's message **clearly matches a tool use case**


**  RESPOND ONLY WITH A JSON OBJECT in the format:  **
{{
  "function": "function_name",
  "parameters": {{ ... }}
}}

keep in mind that todays date is {date.today()} and tomorrow is {date.today() + timedelta(days=1)}, you can add or subtract days from today 
to come up with the date 

Additionally, i have given all of the information regarding all of the journal entries and their information, so you can access them via:

{allJournalEntries}


the current journal entry the user is looking at is given by the number {currentEntry}. match the number here to the ID of allJournalEntries to find
the current journal entry the user is on. However, if currentEntry is 0, then the user is not inside of a journal entry.

If no tool is needed, respond with a regular helpful message.


NOT ALL RESPONSES REQUIRE THESE TOOLS. if the question can be answered without a tool, answer without a tool first. 

if a user asks to change the entry text or the entry rating and currentEntry is 0, then do not call on any tools and specify that a user has to be inside of an entry.

for deleting entries, find the corresponding ID to the title or number the user inputs best. 
look at {previousAIMessages} to check if you had already asked to confirm.

in case you are unclear on what the user is saying / responding to, i provided a log of your previous message {previousAIMessages}, which may help. if the
user's message can be answered without referring to previous messages, then use that 

if the user's message is not clear to understand, explain that you do not understand what the user is saying.


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

