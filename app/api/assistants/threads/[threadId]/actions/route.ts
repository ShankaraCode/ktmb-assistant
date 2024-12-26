import { openai } from "@/app/openai";

// Send a new message to a thread
export async function POST(request, { params: { threadId } }) {
  console.log("[TOOL OUTPUT SUBMIT] Submitting tool outputs to thread:", threadId);

  try {
    const { toolCallOutputs, runId } = await request.json();
    console.log("[TOOL OUTPUT DATA] Run ID:", runId);
    console.log("[TOOL OUTPUT DATA] Outputs:", toolCallOutputs);

    const stream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: toolCallOutputs }
    );

    console.log("[STREAM STARTED] Streaming tool output response...");
    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error("[TOOL OUTPUT ERROR]", error);
    return new Response(
      JSON.stringify({ error: "Failed to submit tool outputs or start stream" }),
      { status: 500 }
    );
  }
}


// beta.threads.runs.submitToolOutputsStream
// beta.threads.create
// beta.threads.messages.create
// beta.threads.messages.stream


// beta.assistants.create
// beta.threads.create
// beta.threads.messages.list
// beta.threads.runs.createAndPoll
