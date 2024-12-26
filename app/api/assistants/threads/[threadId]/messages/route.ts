import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  console.log("[MESSAGE SEND] Initiating message send to thread:", threadId);

  try {
    const { content } = await request.json();
    console.log("[MESSAGE CONTENT]", content);

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });
    console.log("[MESSAGE SENT] Message successfully sent to thread:", threadId);

    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });
    console.log("[STREAM STARTED] Streaming response from assistant:", assistantId);

    const readableStream = stream.toReadableStream();

    // Use a TransformStream to handle stream chunks
    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = readableStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("[STREAM ENDED] Assistant finished streaming.");
              break;
            }
            console.log("[STREAM DATA CHUNK]", new TextDecoder().decode(value));
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("[STREAM ERROR]", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(transformedStream);
  } catch (error) {
    console.error("[MESSAGE ERROR]", error);
    return new Response(
      JSON.stringify({ error: "Failed to send message or start stream" }),
      { status: 500 }
    );
  }
}
