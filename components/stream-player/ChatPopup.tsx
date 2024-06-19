import React, { useState } from 'react';

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Add any other props you need
}

const ChatPopup: React.FC<ChatPopupProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle message submission
    console.log('Submitted message:', message);
    setMessage('');
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'visible' : 'invisible'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg px-4 py-2"
          >
            Send
          </button>
        </form>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;