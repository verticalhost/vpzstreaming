"use client";

import React, { useEffect, useRef, useState } from "react";
import { RemoteParticipant } from "livekit-client";
import { FullscreenControl } from "./fullscreen-control";
import { VolumeControl } from "./volume-control";

interface LiveVideoProps {
  participant: RemoteParticipant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video && participant.videoTracks) {
      const track = participant.videoTracks.values().next().value;
      if (track) {
        track.attach(video);
        return () => {
          track.detach(video);
        };
      }
    }
  }, [participant.videoTracks]);

  const toggleFullscreen = () => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      if (isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {
        if (wrapper.requestFullscreen) {
          wrapper.requestFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const onVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (video && participant.audioTracks) {
      participant.setVolume(value / 100);
      setVolume(value);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video && participant.audioTracks) {
      const audioTrack = participant.audioTracks.values().next().value;
      if (audioTrack) {
        audioTrack.track.isEnabled = !audioTrack.track.isEnabled;
        setVolume(audioTrack.track.isEnabled ? 100 : 0);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (videoRef.current && participant.videoTracks) {
        const videoTrack = participant.videoTracks.values().next().value;
        if (videoTrack) {
          setCurrentTime(videoTrack.track.currentTime);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [participant.videoTracks]);

  return (
    <div ref={wrapperRef} className="relative h-full flex">
      <video ref={videoRef} width="100%" />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all">
        <div className="absolute top-0 left-0 p-2 bg-black/50 text-white">
          {formatTime(currentTime)}
        </div>
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
          <VolumeControl
            onChange={onVolumeChange}
            value={volume}
            onToggle={toggleMute}
          />
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
