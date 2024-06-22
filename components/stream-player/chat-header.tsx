// components/stream-player/chat-header.tsx

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";
import { Button } from "@/components/ui/button"; // Import Button

export const ChatHeader = () => {
  const openChatInNewWindow = () => {
    window.open('/chat-window', 'ChatWindow', 'width=400,height=600');
  };

  return (
    <div className="relative p-3 border-b">
      <div className="absolute left-2 top-2 hidden lg:block">
        <ChatToggle />
      </div>
      <p className="font-semibold text-primary text-center">
        Stream Chat
      </p>
      <div className="absolute right-2 top-2 flex items-center gap-x-2">
        <VariantToggle />
        <Button onClick={openChatInNewWindow} variant="ghost" className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent">
          Open in New Window
        </Button>
      </div>
    </div>
  );
};

export const ChatHeaderSkeleton = () => {
  return (
    <div className="relative p-3 border-b hidden md:block">
      <Skeleton className="absolute h-6 w-6 left-3 top-3" />
      <Skeleton className="w-28 h-6 mx-auto" />
    </div>
  );
};
