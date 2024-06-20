"use client";

import { useEffect } from "react";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import { Chat } from "@/components/stream-player/chat";

const ChatPopup = () => {
  const { onExpand } = useChatSidebar((state) => state);

  useEffect(() => {
    onExpand(); // Assurez-vous que le chat est toujours visible dans le pop-up
  }, [onExpand]);

  return (
    <div className="p-4">
      <Chat
        hostName="Host Name"
        hostIdentity="Host Identity"
        viewerName="Viewer Name"
        isFollowing={true}
        isChatEnabled={true}
        isChatDelayed={false}
        isChatFollowersOnly={false}
      />
    </div>
  );
};

export default ChatPopup;