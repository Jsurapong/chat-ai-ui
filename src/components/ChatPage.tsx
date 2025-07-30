"use client";

import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChartArea/ChatArea";

import { ConfigProvider } from "ds-markdown";

import defaultLocale from "ds-markdown/i18n/en";
import useChatCustom from "@/hooks/useChat";

function ChatPage({ id }: { id?: string }) {
  const {
    recentMessages,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  } = useChatCustom({ id });

  return (
    <ConfigProvider locale={defaultLocale}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar recentMessages={recentMessages} />

        {/* Main Chat Area */}
        <ChatArea
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
        />
      </div>
    </ConfigProvider>
  );
}

export default ChatPage;
