import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectStomp, disconnectStomp } from "./store/stomp/stomp-slice";
import "./App.css";

const App = () => {
  const messages = useSelector((state) => state.stomp.messages);
  console.log(messages);
  const [user, setUser] = useState("");
  const [isUserSet, setIsUserSet] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Connecting to WebSocket...");
    dispatch(connectStomp());
    return () => {
      console.log("Disconnecting from WebSocket...");
      dispatch(disconnectStomp());
    };
  }, [dispatch]);

  const handleSend = (e) => {
    e.preventDefault();
    const payload = {
      from: user,
      text: message,
    };
    dispatch({
      type: "send",
      destination: "/app/chat",
      payload: payload,
    });
    setMessage("");
  };

  const handleSetUser = (user) => {
    setUser(user);
    setIsUserSet(true);
  };
    

  if (!isUserSet) {
    return (
      <div className="app">
        <h1>WebSocket Chat</h1>
        <form onSubmit={() => handleSetUser(user)} className="form">
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username"
          />
          <button type="submit">SET</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>WebSocket Chat</h1>
      <div className="chat-container">
        {messages &&
          messages.map((message, index) => {
            const messageObj = JSON.parse(message);
            return (
              <div
                key={index}
                className={`chat-message-${
                  messageObj.from === user ? "outgoing" : "incoming"
                }`}
              >
                <div
                  className={`chat-bubble-${
                    messageObj.from === user ? "outgoing" : "incoming"
                  }`}
                >
                  <div className="chat-header">
                    <span className="chat-username">{messageObj.from}</span>
                  </div>
                  <div className="chat-text">{messageObj.text}</div>
                  <span className="chat-time">
                      {new Date().toLocaleTimeString()}
                    </span>
                </div>
              </div>
            );
          })}
      </div>
      <form onSubmit={handleSend} className="form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;
