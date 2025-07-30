import {} from "next/navigation";
import { useRouter } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import useRecentChat from "@/hooks/useRecentChat";

export default function Sidebar() {
  const router = useRouter();

  const { history } = useRecentChat();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800 p-2">
      <div className="flex-shrink-0">
        <button
          onClick={() => {
            router.push(`/chat/`);
          }}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>

      <nav className="mt-6 flex-1">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Recent
        </h2>
        {/* Placeholder for recent chats list */}
        <div className="mt-2 space-y-2">
          {history.map((i) => {
            return (
              <a
                key={i.id}
                href="#"
                onClick={() => {
                  router.push(`/chat/${i.id}`);
                }}
                className="block p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {i.title}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto flex-shrink-0">{/* Settings, Help, etc. */}</div>
    </aside>
  );
}
