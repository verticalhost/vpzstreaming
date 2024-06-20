"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChatToggle } from "./chat-toggle";
import { VariantToggle } from "./variant-toggle";
import { useChatPopup } from "@/hooks/use-chat-popup";

export const ChatHeader = () => {
  const { openPopup } = useChatPopup(); // Utilisez le hook

  return (
    <div className="relative p-3 border-b">
      <div className="absolute left-2 top-2 hidden lg:block">
        <ChatToggle />
      </div>
      <p className="font-semibold text-priamry text-center">
        Stream Chat
      </p>
      <div className="absolute right-2 top-2 flex items-center gap-2">
        <VariantToggle />
        <button onClick={openPopup} className="text-white p-1.5 hover:bg-white/10 rounded-lg">
          Open Chat in Popup
        </button>
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
