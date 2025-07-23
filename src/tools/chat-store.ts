import { generateId, Message } from "ai";
import { existsSync, mkdirSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function createChat(): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await writeFile(getChatFile(id), "[]"); // create an empty chat file
  return id;
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });

  return path.join(chatDir, `${id}.json`);
}

export async function loadChat(id: string): Promise<Message[]> {
  try {
    const file = await readFile(getChatFile(id), "utf-8");
    return JSON.parse(file);
  } catch (error) {
    return JSON.parse("[]");
  }
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content);
}

export async function getChatIds(): Promise<{ id: string; title: string }[]> {
  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) return [];
  const files = (await import("fs/promises")).readdir(chatDir);
  const chatIds: { id: string; title: string }[] = [];
  for (const file of await files) {
    if (!file.endsWith(".json")) continue;
    const id = file.replace(/\.json$/, "");
    const filePath = path.join(chatDir, file);
    try {
      const content = await readFile(filePath, "utf8");
      const messages: Message[] = JSON.parse(content);
      if (messages.length === 0) continue;

      const userMessages = messages.filter((i) => i.role === "user");

      const title =
        userMessages[userMessages.length - 1]?.content?.slice(0, 30) ||
        "Untitled Chat";
      chatIds.push({ id, title });
    } catch {
      chatIds.push({ id, title: "Untitled Chat" });
    }
  }
  return chatIds;
}
