import { useEffect, useRef, useState } from "react";
import "../Chatbot/Chatbot.css";

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

  const interleave = (list1: string[], list2: string[]) => {
    const result = [];
    const maxLength = Math.max(list1.length, list2.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < list1.length) result.push(list1[i]);
      if (i < list2.length) result.push(list2[i]);
    }

    return result;
  };

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
            combinedMessages.map((e, i) => (
              <p key={i} className={i % 2 == 0 ? "userMessage" : "AIMessage"}>
                <span
                  className={i % 2 == 0 ? "userMessageSpan" : "AIMessageSpan"}
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
