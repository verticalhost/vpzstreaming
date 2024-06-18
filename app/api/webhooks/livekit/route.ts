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
    console.log("No authorization header");
    return new Response("No authorization header", { status: 400 });
  }

  try {
    const event = receiver.receive(body, authorization);

    if (event.event === "ingress_started") {
      console.log("Stream started event received:", event);

      // Mettre à jour la table des streams
      const stream = await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
        include: {
          user: true, // Inclure les informations de l'utilisateur associé
        },
      });

      if (!stream.user) {
        throw new Error("Utilisateur non trouvé pour l'identifiant d'entrée fourni.");
      }

      const { username, imageUrl } = stream.user;
      const profileUrl = `https://verticalpixelzone.com/${username}`;

      console.log("Database updated, sending notification to Discord webhook");

      // Envoyer une notification à Discord via le webhook
      const discordMessage = {
        content: `🚨 A new stream has started! 🚨\nWatch [${username}](${profileUrl}) live now!`,
        embeds: [
          {
            title: `New stream by ${username}`,
            url: profileUrl,
            thumbnail: {
              url: imageUrl
            },
          },
        ],
      };

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordMessage),
      });

      console.log("Notification sent to Discord");
    }

    if (event.event === "ingress_ended") {
      console.log("Stream ended event received:", event);

      await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });

      console.log("Database updated for stream end");
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Error processing event:", error);
    return new Response("Error processing event", { status: 500 });
  }
}
