import { NextRequest, NextResponse } from "next/server";
import { chatStorage } from "@/storage/storageAdapter";

export async function GET(request: NextRequest) {
  try {
    const chatIds = await chatStorage.getChatIds();
    return NextResponse.json(chatIds, { status: 200 });
  } catch (error) {
    console.error("Error getting chat IDs:", error);
    return NextResponse.json(
      { error: "Failed to get chat list" },
      { status: 500 }
    );
  }
}
