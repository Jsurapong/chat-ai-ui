import {
  streamText,
  appendResponseMessages,
  createIdGenerator,
  appendClientMessage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { chatStorage } from "@/storage/storageAdapter";

export async function POST(req: Request) {
  // get the last message from the client:
  const { message, id } = await req.json();

  // load the previous messages from the server:
  const previousMessages = await chatStorage.loadChat(id);

  const messages = appendClientMessage({
    messages: previousMessages,
    message,
  });

  const result = streamText({
    model: openai("o4-mini"),
    system:
      "You are a code assistant that helps users with their coding questions.",
    messages,
    async onFinish({ response }) {
      await chatStorage.saveChat(
        id,
        appendResponseMessages({
          messages,
          responseMessages: response.messages,
        })
      );
    },
    experimental_generateMessageId: createIdGenerator({
      prefix: "msgs",
      size: 16,
    }),
  });

  // consume the stream to ensure it runs to completion & triggers onFinish
  // even when the client response is aborted:
  result.consumeStream(); // no await

  return result.toDataStreamResponse();
}
