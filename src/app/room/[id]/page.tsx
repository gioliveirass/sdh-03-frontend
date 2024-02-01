"use client";

import { useContext, useEffect, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";

import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);

  const localStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket?.on("connect", () => {
      socket?.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
      });
    });

    initWebcamAndAudio();
  }, [socket]);

  const initWebcamAndAudio = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });

    if (localStream.current) localStream.current.srcObject = video;
  };

  return (
    <div className="h-screen">
      <Header />

      <div className="flex h-[75%]">
        <div className="md:w-[81%] w-full m-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video
                className="h-full w-full"
                ref={localStream}
                autoPlay
                playsInline
              />
              <span className="absolute bottom-3">Giovana Silva</span>
            </div>

            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="h-full w-full" src=""></video>
              <span className="absolute bottom-3">Giovana Silva</span>
            </div>

            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="h-full w-full" src=""></video>
              <span className="absolute bottom-3">Giovana Silva</span>
            </div>

            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video className="h-full w-full" src=""></video>
              <span className="absolute bottom-3">Giovana Silva</span>
            </div>
          </div>
        </div>

        <Chat roomId={params.id} />
      </div>

      <Footer />
    </div>
  );
}
