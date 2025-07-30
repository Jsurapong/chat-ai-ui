"use client";

import Sidebar from "@/components/Sidebar";
import ChatArea2 from "@/components/ChartArea/ChatArea";

import { ConfigProvider } from "ds-markdown";

import defaultLocale from "ds-markdown/i18n/en";

export default function Chat({ id }: { id?: string | undefined }) {
  return (
    <ConfigProvider locale={defaultLocale}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Chat Area */}
        <ChatArea2 id={id} />
      </div>
    </ConfigProvider>
  );
}
