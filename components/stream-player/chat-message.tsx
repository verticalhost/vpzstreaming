// chat-message.tsx

"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
// Removed unnecessary import
import { stringToColor } from "@/lib/utils"; // Ensure stringToColor is imported correctly

interface ChatMessageProps {
  message: string; // Only the message string is needed
}

/**
 * Custom hook to fetch and manage 7TV emotes for a specific user.
 * @returns An object containing the fetched emotes and any error that occurred during the fetch.
 */
const use7tvEmotes = () => {
  const userID = "666b712aa4cae22f82d9e135"; // Fixed user ID
  const [emotes, setEmotes] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEmotes = async () => {
      try {
        // Fetch the user directly using the hardcoded user ID
        const userResponse = await fetch(`https://7tv.io/v3/users/${userID}`);
        if (!userResponse.ok) {
          const errorText = await userResponse.text();
          throw new Error(`Failed to fetch user. Status: ${userResponse.status}, Message: ${errorText}`);
        }

        const userData = await userResponse.json();

        if (!userData || !userData.emote_sets || userData.emote_sets.length === 0) {
          throw new Error(`No emote set found for the specified user ID: ${userID}`);
        }
        const emoteSetId = userData.emote_sets[0].id;

        // Fetch the user's emote set using the emote set ID
        const emoteSetResponse = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetId}`);
        if (!emoteSetResponse.ok) {
          const errorText = await emoteSetResponse.text();
          throw new Error(`Failed to fetch emote set. Status: ${emoteSetResponse.status}, Message: ${errorText}`);
        }
        const emoteSetData = await emoteSetResponse.json();

        if (!emoteSetData.emotes) {
          throw new Error("No emote set found for the user.");
        }

        // Fetch each emote by its ID using the Get Emote endpoint
        const fetchedEmotes = await Promise.all(
          emoteSetData.emotes.map(async (emote: any) => {
            const emoteResponse = await fetch(`https://7tv.io/v3/emotes/${emote.id}`);
            if (!emoteResponse.ok) {
              return null;
            }
            const emoteData = await emoteResponse.json();
            return emoteData;
          })
        );

        // Create a dictionary of emote URLs
        const emotes = fetchedEmotes.reduce((acc: any, emote: any) => {
          if (emote && emote.host && emote.host.url && emote.host.files && emote.host.files.length > 0) {
            const emoteFile = emote.host.files.find((file: any) => file.format === "WEBP" || file.format === "GIF") || emote.host.files[0];
            if (emoteFile && emote.host.url) {
              acc[emote.name] = `https:${emote.host.url}/${emoteFile.name}`;
            }
          }
          return acc;
        }, {});

        setEmotes(emotes);
      } catch (error: any) {
        setError(`Error fetching 7tv emotes: ${error.message}`);
      }
    };

    fetchEmotes();
  }, [userID]);

  return { emotes, error };
};

const parseEmotes = (message: string, emotes: { [key: string]: string }) => {
  const words = message.split(" ");
  return words.map((word, index) => {
    if (emotes[word]) {
      return <img key={index} src={emotes[word]} alt={word} className="inline h-5" />;
    }
    return <span key={index}>{word} </span>;
  });
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const { emotes, error } = use7tvEmotes();

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md hover:bg-white/5">
      {error && (
        <div>
          <div>Error: {error}</div>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm break-all">
          {parseEmotes(message, emotes)}
        </p>
      </div>
    </div>
  );
};
