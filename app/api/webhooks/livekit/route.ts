import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import fetch from "node-fetch";

import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const WEBHOOK_URL = "https://discord.com/api/webhooks/1052278065834770552/7eQaisn4R1N_3RDpJgF9a2RO03mQ3MUsRzpjzva0Bs1tS1YqATx5NxDx7TD9RdOKXCp8";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  const event = receiver.receive(body, authorization);

  if (event.event === "ingress_started") {
    await db.stream.update({
      where: {
        ingressId: event.ingressInfo?.ingressId,
      },
      data: {
        isLive: true,
      },
    });

    // Envoyer une notification à Discord via le webhook
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "🚨 New stream is just started on VPZ ! 🚨",
      }),
    });
  }

  if (event.event === "ingress_ended") {
    await db.stream.update({
      where: {
        ingressId: event.ingressInfo?.ingressId,
      },
      data: {
        isLive: false,
      },
    });
  }

  return new Response("ok", { status: 200 });
}
