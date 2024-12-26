import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new thread
export async function POST() {
  console.log("[THREAD CREATION] Initiating thread creation...");

  try {
    const thread = await openai.beta.threads.create();
    console.log("[THREAD CREATED] Thread ID:", thread.id);

    return Response.json({ threadId: thread.id });
  } catch (error) {
    console.error("[THREAD CREATION ERROR]", error);
    return new Response(
      JSON.stringify({ error: "Failed to create thread" }),
      { status: 500 }
    );
  }
}