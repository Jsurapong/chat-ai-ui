// import { getChatIds, loadChat } from "@/tools/chat-store";
import Chat from "@/components/Chat";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  // const messages = await loadChat(id); // load the chat messages

  // const history = await getChatIds();

  return <Chat id={id} />; // display the chat
}
