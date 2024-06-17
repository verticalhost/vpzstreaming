"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image from next/image
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatInfo } from "./chat-info";

interface ChatFormProps {
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
  isHidden: boolean;
  isFollowersOnly: boolean;
  isFollowing: boolean;
  isDelayed: boolean;
}

const use7tvEmotes = () => {
  const userID = "666b712aa4cae22f82d9e135";
  const [emotes, setEmotes] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEmotes = async () => {
      try {
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

        const emoteSetResponse = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetId}`);
        if (!emoteSetResponse.ok) {
          const errorText = await emoteSetResponse.text();
          throw new Error(`Failed to fetch emote set. Status: ${emoteSetResponse.status}, Message: ${errorText}`);
        }
        const emoteSetData = await emoteSetResponse.json();

        if (!emoteSetData.emotes) {
          throw new Error("No emote set found for the user.");
        }

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

        const emotes = fetchedEmotes.reduce((acc: any, emote: any) => {
          if (emote && emote.host && emote.host.url && emote.host.files && emote.host.files.length > 0) {
            const emoteFile = emote.host.files.find(
              (file: any) => file.format === "WEBP" || file.format === "GIF"
            ) || emote.host.files[0];
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

export const ChatForm = ({
  onSubmit,
  value,
  onChange,
  isHidden,
  isFollowersOnly,
  isFollowing,
  isDelayed,
}: ChatFormProps) => {
  const [isDelayBlocked, setIsDelayBlocked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { emotes, error } = use7tvEmotes();

  const isFollowersOnlyAndNotFollowing = isFollowersOnly && !isFollowing;
  const isDisabled = isHidden || isDelayBlocked || isFollowersOnlyAndNotFollowing;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!value || isDisabled) return;

    if (isDelayed && !isDelayBlocked) {
      setIsDelayBlocked(true);
      setTimeout(() => {
        setIsDelayBlocked(false);
        onSubmit();
      }, 3000);
    } else {
      onSubmit();
    }
  };

  const handlePopupClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleGridButtonClick = (key: string) => {
    onChange(key);
    setIsPopupOpen(false);
  };

  if (isHidden) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-y-4 p-3 relative">
      <div className="w-full">
        <ChatInfo isDelayed={isDelayed} isFollowersOnly={isFollowersOnly} />
        <Input
          onChange={(e) => onChange(e.target.value)}
          value={value}
          disabled={isDisabled}
          placeholder="Send a message"
          className={cn(
            "border-white/10",
            (isFollowersOnly || isDelayed) && "rounded-t-none border-t-0"
          )}
        />
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <Button type="submit" variant="primary" size="sm" disabled={isDisabled}>
          Chat
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={handlePopupClick}>
          Emoji
        </Button>
        {isPopupOpen && (
          <div className="absolute mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50">
            {error ? (
              <div>Error: {error}</div>
            ) : (
              <div className="grid grid-cols-9 gap-1 p-1">
                {Object.keys(emotes).map((key, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleGridButtonClick(key)}
                    className="h-10 w-10"
                  >
                    <Image src={emotes[key]} alt={key} className="w-full h-full object-contain" width={40} height={40} />
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export const ChatFormSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 p-3">
      <Skeleton className="w-full h-10" />
      <div className="flex items-center gap-x-2 ml-auto">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  );
};
