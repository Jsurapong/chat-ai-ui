import ChatPage from "@/components/ChatPage";
import { chatStorage } from "@/storage/storageAdapter";

export default async function Page() {
  const id = await chatStorage.createChat(); // create a new chat
  return <ChatPage id={id} />; // display the chat
}
