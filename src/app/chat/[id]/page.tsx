import ChatPage from "@/components/ChatPage";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL

  return <ChatPage id={id} />; // display the chat
}
