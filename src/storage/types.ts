import { Message } from "ai";

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

export interface StorageAdapter {
  createChat(): Promise<string>;
  loadChat(id: string): Promise<Message[]>;
  saveChat(id: string, messages: Message[]): Promise<void>;
  getChatIds(): Promise<Chat[]>;
  deleteChat(id: string): Promise<void>;
  clearAllChats(): Promise<void>;
}

export type StorageType = "file";
