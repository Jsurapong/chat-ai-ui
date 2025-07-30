import { generateId, Message } from "ai";
import { existsSync, mkdirSync } from "fs";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { StorageAdapter, Chat } from "./types";

export class FileStorageAdapter implements StorageAdapter {
  private getChatFile(id: string): string {
    const chatDir = path.join(process.cwd(), ".chats");
    if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
    return path.join(chatDir, `${id}.json`);
  }

  private getChatDir(): string {
    return path.join(process.cwd(), ".chats");
  }

  async createChat(): Promise<string> {
    const id = generateId();
    await writeFile(this.getChatFile(id), "[]");
    return id;
  }

  async loadChat(id: string): Promise<Message[]> {
    try {
      const file = await readFile(this.getChatFile(id), "utf-8");
      return JSON.parse(file);
    } catch (error) {
      return [];
    }
  }

  async saveChat(id: string, messages: Message[]): Promise<void> {
    const content = JSON.stringify(messages, null, 2);
    await writeFile(this.getChatFile(id), content);
  }

  async getChatIds(): Promise<Chat[]> {
    const chatDir = this.getChatDir();
    if (!existsSync(chatDir)) return [];

    const files = (await import("fs/promises")).readdir(chatDir);
    const chatIds: Chat[] = [];

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
        const createdAt = `${userMessages[0]?.createdAt || ""}`;

        chatIds.push({ id, title, createdAt });
      } catch {
        chatIds.push({ id, title: "Untitled Chat", createdAt: "" });
      }
    }

    return chatIds;
  }

  async deleteChat(id: string): Promise<void> {
    try {
      await unlink(this.getChatFile(id));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  }

  async clearAllChats(): Promise<void> {
    const chatIds = await this.getChatIds();
    await Promise.all(chatIds.map((chat) => this.deleteChat(chat.id)));
  }
}
