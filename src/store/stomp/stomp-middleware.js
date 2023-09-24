import { Client } from "@stomp/stompjs";

import { addMessage } from "./stomp-slice";

export const stompMiddleware = ({ dispatch }) => {
  const client = new Client({
    brokerURL: "ws://localhost:8080/websocket",
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 1000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000,
  });

  client.onConnect = function (frame) {
    client.subscribe("/topic/messages", (message) => {
      // called when the client receives a STOMP message from the server
      if (message.body) {
        dispatch(addMessage(message.body));
      } else {
        dispatch(addMessage("Got empty message"));
      }
    });

  };

  client.onStompError = function (frame) {
    // Will be invoked in case of error encountered at Broker
    console.error("Broker reported error: " + frame.headers["message"]);
    console.error("Additional details: " + frame.body);
  };

  return (next) => (action) => {
    switch (action.type) {
      case "connect":
        client.activate();
        break;
      case "disconnect":
        client.deactivate();
        break;
      case "send":
        client.publish({
          destination: action.destination,
          body: JSON.stringify(action.payload),
        });
        break;
      default:
        return next(action);
    }
  };
};

