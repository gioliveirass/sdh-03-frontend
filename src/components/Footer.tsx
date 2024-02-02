"use client";

import { MutableRefObject, RefObject, useState } from "react";

import {
  IconDesktop,
  IconDesktopDisabled,
  IconMicrophone,
  IconMicrophoneDisabled,
  IconTelephone,
  IconVideo,
  IconVideoDisabled,
} from "@/icons";

import Container from "./Container";

export default function Footer({
  mediaStream,
  peerConnections,
  localStream,
  logout,
}: {
  mediaStream: MediaStream | null;
  peerConnections: MutableRefObject<Record<string, RTCPeerConnection>>;
  localStream: RefObject<HTMLVideoElement>;
  logout: () => void;
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0") + ":";
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const toggleMuted = () => {
    mediaStream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender: any) => {
        if (sender.track.kind === "audio") {
          sender.track.enabled = !isMuted;
        }
      });
    });

    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    mediaStream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender: any) => {
        if (sender.track.kind === "video") {
          sender.track.enabled = isCameraOff;
        }
      });
    });

    setIsCameraOff(!isCameraOff);
  };

  const toggleScreenSharing = async () => {
    if (!isScreenSharing) {
      const videoShareScreen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      if (localStream && localStream.current)
        localStream.current.srcObject = videoShareScreen;

      Object.values(peerConnections.current).forEach((peerConnection) => {
        peerConnection.getSenders().forEach((sender: any) => {
          if (sender.track.kind === "video") {
            sender.replaceTrack(videoShareScreen.getVideoTracks()[0]);
          }
        });
      });

      setIsScreenSharing(!isScreenSharing);

      return;
    }

    if (localStream && localStream.current)
      localStream.current.srcObject = mediaStream;

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender: any) => {
        if (sender.track.kind === "video") {
          sender.replaceTrack(mediaStream?.getVideoTracks()[0]);
        }
      });
    });

    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <section
      id="footer"
      className="fixed items-center bottom-0 bg-black py-6 w-full"
    >
      <Container>
        <div className="grid grid-cols-3">
          <div className="flex items-center">
            <span className="text-xl">{hours + minutes}</span>
          </div>

          <div className="flex space-x-6 justify-center">
            {isMuted ? (
              <IconMicrophoneDisabled
                className="h-12 w-16 text-white p-2 rounded-md cursor-pointer bg-red-500"
                onClick={() => toggleMuted()}
              />
            ) : (
              <IconMicrophone
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => toggleMuted()}
              />
            )}

            {isCameraOff ? (
              <IconVideoDisabled
                className="h-12 w-16 text-white p-2 rounded-md cursor-pointer bg-red-500"
                onClick={() => toggleCamera()}
              />
            ) : (
              <IconVideo
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => toggleCamera()}
              />
            )}

            {isScreenSharing ? (
              <IconDesktopDisabled
                className="h-12 w-16 text-white p-2 rounded-md cursor-pointer bg-red-500"
                onClick={() => toggleScreenSharing()}
              />
            ) : (
              <IconDesktop
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => toggleScreenSharing()}
              />
            )}

            <IconTelephone
              onClick={() => logout()}
              className="h-12 w-16 text-white p-2 bg-primary rounded-md cursor-pointer hover:bg-red-500"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
