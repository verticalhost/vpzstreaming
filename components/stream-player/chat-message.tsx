"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ReceivedChatMessage } from "@livekit/components-react";
import { stringToColor } from "@/lib/utils";  // Ensure stringToColor is imported correctly

interface ChatMessageProps {
  data: ReceivedChatMessage;
}

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

           // Fetch the user's emote set using the emote set ID
        const emoteSetResponse = await fetch(`https://7tv.io/v3/emote_sets/${emoteSetId}`);
        if (!emoteSetResponse.ok) {
          const errorText = await emoteSetResponse.text();
          throw new Error(`Failed to fetch emote set. Status: ${emoteSetResponse.status}, Message: ${errorText}`);
        }

        const emoteSetData = await emoteSetResponse.json();

        if (!emoteSetData || !emoteSetData.emotes || emoteSetData.emotes.length === 0) {
          throw new Error(`No emotes found for the specified emote set ID: ${emoteSetId}`);
        }

        // Map the emotes to a key-value pair object
        const emotes = emoteSetData.emotes.reduce((acc, emote) => {
          acc[emote.name] = emote.urls[1];
          return acc;
        }, {});

        setEmotes(emotes);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEmotes();
  }, []);

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

export const ChatMessage = ({ data }: ChatMessageProps) => {
  const color = stringToColor(data.from?.name || "");
  const { emotes, error } = use7tvEmotes();

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md hover:bg-white/5">
      <p className="text-sm text-white/40">
        {format(data.timestamp, "HH:mm")}
      </p>
      {error && (
        <div>
          <div>Error: {error}</div>
        </div>
      )}
      <div className="flex flex-wrap items-baseline gap-1 grow">
        <p className="text-sm font-semibold whitespace-nowrap">
          <span className="truncate" style={{ color: color }}>
            {data.from?.name}:
          </span>
        </p>
        <p className="text-sm break-all">
          {parseEmotes(data.message, emotes)}
        </p>
      </div>
    </div>
  );
};