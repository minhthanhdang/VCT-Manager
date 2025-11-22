import React from "react";
import ChatBot from "../_components/chatbot";
import StatusSidebar from "../../../../components/status-sidebar";

const Conversation = () => {
  return (
    <div className="flex h-full relative overflow-hidden">
      <ChatBot />
      <StatusSidebar />
    </div>
  );
};

export default Conversation;
