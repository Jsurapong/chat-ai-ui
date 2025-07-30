import { NextRequest, NextResponse } from "next/server";
import { chatStorage } from "@/storage/storageAdapter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await chatStorage.loadChat(id);
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error loading chat:", error);
    return NextResponse.json({ error: "Failed to load chat" }, { status: 500 });
  }
}
