import { Message } from "ai";
import { StorageAdapter, Chat, StorageType } from "./types";
import { FileStorageAdapter } from "./fileStorageAdapter";

// Storage factory function
function createStorageAdapter(type: StorageType): StorageAdapter {
  switch (type) {
    case "file":
      return new FileStorageAdapter();

    default:
      return new FileStorageAdapter();
  }
}

// Function-based adapter that wraps the class-based adapters
export class FunctionAdapter {
  private adapter: StorageAdapter;
  private storageType: StorageType;

  constructor(storageType: StorageType = "file") {
    this.storageType = storageType;
    this.adapter = createStorageAdapter(storageType);
  }

  // Switch storage type dynamically
  switchStorageType(type: StorageType): void {
    this.storageType = type;
    this.adapter = createStorageAdapter(type);
  }

  // Get current storage type
  getCurrentStorageType(): StorageType {
    return this.storageType;
  }

  // Unified API functions
  async createChat(): Promise<string> {
    try {
      return await this.adapter.createChat();
    } catch (error) {
      console.error(`Error creating chat with ${this.storageType}:`, error);
      throw new Error(`Failed to create chat: ${error}`);
    }
  }

  async loadChat(id: string): Promise<Message[]> {
    try {
      return await this.adapter.loadChat(id);
    } catch (error) {
      console.error(
        `Error loading chat ${id} with ${this.storageType}:`,
        error
      );
      return [];
    }
  }

  async saveChat(id: string, messages: Message[]): Promise<void> {
    try {
      await this.adapter.saveChat(id, messages);
    } catch (error) {
      console.error(`Error saving chat ${id} with ${this.storageType}:`, error);
      throw new Error(`Failed to save chat: ${error}`);
    }
  }

  async getChatIds(): Promise<Chat[]> {
    try {
      return await this.adapter.getChatIds();
    } catch (error) {
      console.error(`Error getting chat IDs with ${this.storageType}:`, error);
      return [];
    }
  }

  async deleteChat(id: string): Promise<void> {
    try {
      await this.adapter.deleteChat(id);
    } catch (error) {
      console.error(
        `Error deleting chat ${id} with ${this.storageType}:`,
        error
      );
      throw new Error(`Failed to delete chat: ${error}`);
    }
  }

  async clearAllChats(): Promise<void> {
    try {
      await this.adapter.clearAllChats();
    } catch (error) {
      console.error(
        `Error clearing all chats with ${this.storageType}:`,
        error
      );
      throw new Error(`Failed to clear all chats: ${error}`);
    }
  }
}

// Convenience function to create adapter instance
export function createChatStorage(type: StorageType = "file"): FunctionAdapter {
  return new FunctionAdapter(type);
}

export const chatStorage = createChatStorage();
