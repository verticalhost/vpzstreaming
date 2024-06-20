import { create } from "zustand";

interface ChatPopupStore {
  openPopup: () => void;
}

export const useChatPopup = create<ChatPopupStore>((set) => ({
  openPopup: () => {
    const popupWindow = window.open(
      "/chat-popup",
      "ChatPopup",
      "width=600,height=400"
    );
    if (popupWindow) {
      popupWindow.focus();
    }
  },
}));