"use client";

import { useState } from "react";

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

export default function Footer() {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0") + ":";
  const minutes = date.getMinutes().toString().padStart(2, "0");

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
                onClick={() => setIsMuted(!isMuted)}
              />
            ) : (
              <IconMicrophone
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setIsMuted(!isMuted)}
              />
            )}

            {isCameraOff ? (
              <IconVideoDisabled
                className="h-12 w-16 text-white p-2 rounded-md cursor-pointer bg-red-500"
                onClick={() => setIsCameraOff(!isCameraOff)}
              />
            ) : (
              <IconVideo
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setIsCameraOff(!isCameraOff)}
              />
            )}

            {isScreenSharing ? (
              <IconDesktopDisabled
                className="h-12 w-16 text-white p-2 rounded-md cursor-pointer bg-red-500"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              />
            ) : (
              <IconDesktop
                className="h-12 w-16 text-white p-2 bg-gray-950 rounded-md cursor-pointer"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              />
            )}

            <IconTelephone className="h-12 w-16 text-white p-2 bg-primary rounded-md cursor-pointer hover:bg-red-500" />
          </div>
        </div>
      </Container>
    </section>
  );
}
