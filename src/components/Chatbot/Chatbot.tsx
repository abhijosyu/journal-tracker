import { useEffect, useRef, useState } from "react";
import "../Chatbot/Chatbot.css";
import { interleave } from "../../Utils";

interface ChatbotProps {
  userMessages: string[];
  AIMessages: string[];
  canSendMessage: boolean;
  onSendMessage: (message: string) => void;
  aiSummary: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  userMessages,
  AIMessages,
  onSendMessage,
  canSendMessage,
  aiSummary,
}) => {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState<string>("");

  const combinedMessages = interleave(userMessages, AIMessages);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [combinedMessages.length]);
  return (
    <>
      <div className="chatbot animateFadeInSide">
        <div className="chatbotMessages" ref={messagesContainerRef}>
          {combinedMessages.length > 0 ? (
            combinedMessages.map(([e, source], i) => (
              <p
                key={i}
                className={source == "user" ? "userMessage" : "AIMessage"}
              >
                <span
                  className={
                    source == "user" ? "userMessageSpan" : "AIMessageSpan"
                  }
                >
                  {e == "" ? "empty" : e}
                </span>
              </p>
            ))
          ) : (
            <>
              <p
                className="chatbotDefaultText"
                style={{ fontSize: "25px", color: "grey", opacity: "0.5" }}
              >
                Ask AI to make an entry, summarize, or just chat
              </p>
            </>
          )}
          {combinedMessages.length > 0 ? <p> {aiSummary} </p> : null}
        </div>

        <div className="chatbotSend">
          <textarea
            spellCheck={false}
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send Message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && canSendMessage) {
                e.preventDefault();
                onSendMessage(message);
                setMessage("");
              }
            }}
          ></textarea>
          <button
            className="buttonSend"
            onClick={() => {
              canSendMessage ? onSendMessage(message) : null;
              setMessage("");
            }}
          >
            ⇧
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
