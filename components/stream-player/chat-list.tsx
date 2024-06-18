// chat-list.tsx

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "./chat-message";

interface ChatListProps {
  messages: any[]; // Assuming messages are properly parsed objects
  isHidden: boolean;
}

export const ChatList = ({ messages, isHidden }: ChatListProps) => {
  if (isHidden || !messages || messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  // Sort messages by timestamp
  const sortedMessages = messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-1 flex-col-reverse overflow-y-auto p-3 h-full">
      {sortedMessages.map((message, index) => (
        <ChatMessage key={index} message={message.message} />
      ))}
    </div>
  );
};

export const ChatListSkeleton = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
};
