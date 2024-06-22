// app/chat-window.tsx

import React from 'react';
import { Chat } from '@/components/stream-player/chat';

const ChatWindow = () => {
  // Vous pouvez passer les props nécessaires au composant Chat ici
  return (
    <div className="h-full">
      <Chat
        hostName="HostName"
        hostIdentity="HostIdentity"
        viewerName="ViewerName"
        isFollowing={true}
        isChatEnabled={true}
        isChatDelayed={false}
        isChatFollowersOnly={false}
      />
    </div>
  );
};

export default ChatWindow;
