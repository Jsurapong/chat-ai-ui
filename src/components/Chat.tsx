"use client";

import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";

import { Message, useChat } from "@ai-sdk/react";
import { useAutoResume } from "@/hooks/use-auto-resume";

export default function Chat({
  id,
  initialMessages,
  history,
}: {
  id?: string | undefined;
  initialMessages?: Message[];
  history: { id: string; title: string }[];
}) {
  const { experimental_resume, data, setMessages } = useChat({ id });

  useAutoResume({
    autoResume: true,
    initialMessages: [],
    experimental_resume,
    data,
    setMessages,
  });

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar history={history} />

      {/* Main Chat Area */}
      <ChatArea id={id} initialMessages={initialMessages} />
    </div>
  );
}
