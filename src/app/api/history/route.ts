import { NextRequest, NextResponse } from "next/server";
import { getChatIds } from "@/tools/chat-store";

export async function GET(request: NextRequest) {
  try {
    const chatIds = await getChatIds();
    return NextResponse.json(chatIds, { status: 200 });
  } catch (error) {
    console.error("Error getting chat IDs:", error);
    return NextResponse.json(
      { error: "Failed to get chat list" },
      { status: 500 }
    );
  }
}
