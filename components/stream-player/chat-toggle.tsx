"use client";

import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebar";
import ReactDOM from 'react-dom/client'; // Update this import
import ChatPopupWindow from './ChatPopupWindow';

export const ChatToggle = () => {
  const {
    collapsed,
    onExpand,
    onCollapse,
  } = useChatSidebar((state) => state);

  const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

  const onToggle = () => {
    if (collapsed) {
      onExpand();
    } else {
      onCollapse();
    }
  };

  const openChatPopup = () => {
    const chatWindow = window.open(
      '',
      'ChatPopup',
      'width=400,height=600'
    );

    if (chatWindow) {
      chatWindow.document.write('<div id="chat-popup-root"></div>');
      chatWindow.document.close();
      chatWindow.onload = () => {
        const rootElement = chatWindow.document.getElementById('chat-popup-root');
        if (rootElement) {
          const root = ReactDOM.createRoot(rootElement); // Use createRoot
          root.render(<ChatPopupWindow />);
        }
      };
    }
  };

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      <Hint label={label} side="left" asChild>
        <Button
          onClick={onToggle}
          variant="ghost"
          className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </Hint>
      <Hint label="Open Chat in New Window" side="left" asChild>
        <Button
          onClick={openChatPopup}
          variant="ghost"
          className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
        >
          Open Chat
        </Button>
      </Hint>
    </>
  );
};
