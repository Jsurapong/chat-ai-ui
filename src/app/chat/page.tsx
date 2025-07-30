import { createChat } from "@/tools/chat-store";
import ChatPage from "@/components/ChatPage";

export default async function Page() {
  const id = await createChat(); // create a new chat
  return <ChatPage id={id} />; // display the chat
}
