// app/popchat/page.tsx

"use client";

import { useState } from "react";
import { Chat } from "@/components/stream-player/chat"; // Assuming you have a Chat component

const PopChatPage = () => {
    const [streamerName, setStreamerName] = useState("");
    const [submittedName, setSubmittedName] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedName(streamerName);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Enter Streamer Name</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={streamerName}
                    onChange={(e) => setStreamerName(e.target.value)}
                    placeholder="Streamer Name"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                    Submit
                </button>
            </form>
            {submittedName && (
                <div>
                    <h2 className="text-xl font-bold mb-4">Chat for {submittedName}</h2>
                    <Chat
                        hostName={submittedName}
                        hostIdentity={submittedName}
                        viewerName="viewer"
                        isFollowing={true}
                        isChatEnabled={true}
                        isChatDelayed={false}
                        isChatFollowersOnly={false}
                        streamerName={submittedName}
                    />
                </div>
            )}
        </div>
    );
};

export default PopChatPage;
