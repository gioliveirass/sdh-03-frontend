"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Stream } from "stream";

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext);

  const [remoteStreams, setRemoteStreams] = useState<
    { id: string; stream: MediaStream }[]
  >([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const localStream = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const router = useRouter();

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("~ ROOM ~ Usuário conectado (socket)");

      socket.emit("subscribe", {
        roomId: params.id,
        socketId: socket.id,
        username:
          sessionStorage.getItem("@talktome:username") ?? "Usuário anônimo",
      });

      initLocalMedia();
    });

    socket?.on("new user", (data: { socketId: string; username: string }) => {
      console.log("~ ROOM ~ Novo usuário tentando se conectar (peer)");

      createPeerConnection(data.socketId, false);
      socket.emit("new user start", { to: data.socketId, sender: socket.id });
    });

    socket?.on("new user start", (data: { sender: string }) => {
      console.log("~ ROOM ~ Novo usuário conectado (peer)");
      createPeerConnection(data.sender, true);
    });

    socket?.on(
      "send peer description",
      (data: { description: RTCSessionDescription; sender: string }) => {
        handleReceivedPeerDescription(data);
      }
    );

    socket?.on(
      "ice candidates",
      (data: { candidate: RTCIceCandidate; sender: string }) => {
        handleIceCandidates(data);
      }
    );
  }, [socket]);

  const initLocalMedia = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });

    setMediaStream(media);
    if (localStream.current) localStream.current.srcObject = media;
  };

  const initRemoteMedia = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { noiseSuppression: true, echoCancellation: true },
    });

    return media;
  };

  const createPeerConnection = async (
    socketId: string,
    createOffer: boolean
  ) => {
    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const peer = new RTCPeerConnection(config);

    peerConnections.current[socketId] = peer;

    const peerConnection = peerConnections.current[socketId];

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
      });
    } else {
      const remoteMedia = await initRemoteMedia();

      remoteMedia.getTracks().forEach((track) => {
        peerConnection.addTrack(track, remoteMedia);
      });
    }

    if (createOffer) {
      console.log("~ ROOM ~ Criando uma oferta de conexão (peer)");

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket?.emit("send peer description", {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];

      const dataStream = {
        id: socketId,
        stream: remoteStream,
      };

      setRemoteStreams((prevState) => {
        if (!prevState.some((stream) => stream.id === socketId)) {
          return [...prevState, dataStream];
        }

        return prevState;
      });
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice candidates", {
          to: socketId,
          sender: socket.id,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.onsignalingstatechange = (event) => {
      switch (peerConnection.signalingState) {
        case "closed":
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId)
          );

          break;
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      switch (peerConnection.connectionState) {
        case "closed":
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId)
          );

        case "failed":
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId)
          );

        case "disconnected":
          setRemoteStreams((prevState) =>
            prevState.filter((stream) => stream.id !== socketId)
          );

          break;
      }
    };
  };

  const handleReceivedPeerDescription = async (receivedPeerDescription: {
    description: RTCSessionDescription;
    sender: string;
  }) => {
    const peerConnection =
      peerConnections.current[receivedPeerDescription.sender];

    if (receivedPeerDescription.description.type === "offer") {
      console.log("~ ROOM ~ Lidando com a oferta de conexão (peer)");

      await peerConnection.setRemoteDescription(
        receivedPeerDescription.description
      );

      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(answer);

      socket?.emit("send peer description", {
        to: receivedPeerDescription.sender,
        sender: socket.id,
        description: peerConnection.localDescription,
      });
    }

    if (receivedPeerDescription.description.type === "answer") {
      console.log("~ ROOM ~ Recebendo resposta da oferta de conexão (peer)");

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(receivedPeerDescription.description)
      );
    }
  };

  const handleIceCandidates = async (candidatesSended: {
    candidate: RTCIceCandidate;
    sender: string;
  }) => {
    const peerConnection = peerConnections.current[candidatesSended.sender];

    if (candidatesSended.candidate) {
      console.log("~ ROOM ~ Aceitando canditato (peer)");

      await peerConnection.addIceCandidate(
        new RTCIceCandidate(candidatesSended.candidate)
      );
    }
  };

  const logout = () => {
    mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.close();
    });

    socket?.disconnect();

    router.push("/");
  };

  return (
    <div className="h-screen">
      <Header />

      <div className="flex h-[75%]">
        <div className="md:w-[81%] w-full m-3">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
            <div className="bg-gray-950 w-full rounded-md h-full p-2 relative">
              <video
                className="h-full w-full mirror-mode"
                ref={localStream}
                autoPlay
                playsInline
              />
              <span className="absolute bottom-3">Giovana Silva</span>
            </div>

            {remoteStreams.map((stream, index) => (
              <div
                className="bg-gray-950 w-full rounded-md h-full p-2 relative"
                key={index}
              >
                <video
                  className="h-full w-full mirror-mode"
                  ref={(video) => {
                    if (video && video.srcObject !== stream.stream)
                      video.srcObject = stream.stream;
                  }}
                  autoPlay
                  playsInline
                />
                <span className="absolute bottom-3">Giovana Silva</span>
              </div>
            ))}
          </div>
        </div>

        <Chat roomId={params.id} />
      </div>

      <Footer
        mediaStream={mediaStream}
        peerConnections={peerConnections}
        localStream={localStream}
        logout={logout}
      />
    </div>
  );
}
