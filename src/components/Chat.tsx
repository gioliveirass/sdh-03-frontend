"use client";

import { useContext, useEffect, useRef, FormEvent, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { IconSend } from "@/icons";

interface ChatMessageInterface {
  message: string;
  username: string;
  roomId: string;
  time: string;
}

export default function Chat({ roomId }: { roomId: string }) {
  const currentMsg = useRef<HTMLInputElement>(null);

  const { socket } = useContext(SocketContext);

  const [chat, setChat] = useState<ChatMessageInterface[]>([]);

  useEffect(() => {
    socket?.on("chat", (data) => {
      console.log("message", data);
      setChat((prevState) => [...prevState, data]);
    });
  }, [socket]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentMsg.current && currentMsg.current.value !== "") {
      const sendMessageToServer = {
        message: currentMsg.current?.value,
        username:
          sessionStorage.getItem("@talktome:username") ?? "Usuário anônimo",
        roomId,
        time: new Date().toLocaleDateString(),
      };

      socket?.emit("chat", sendMessageToServer);

      setChat((prevState) => [...prevState, sendMessageToServer]);

      currentMsg.current.value = "";
    }
  }

  return (
    <section
      id="chat"
      className="relative min-h-[70vh]  bg-gray-900 px-4 pt-4 md:w-[17%] rounded-md m-3 hidden md:flex flex-col"
    >
      <div className="h-full w-full">
        {chat.map((chatMessage, index) => (
          <div className="bg-gray-950 rounded p-2 mb-4" key={index}>
            <div className="flex items-center text-pink-400 space-x-2">
              <span>{chatMessage.username}</span>
              <span>{chatMessage.time}</span>
            </div>

            <div className="mt-5 text-sm">
              <p>{chatMessage.message}</p>
            </div>
          </div>
        ))}

        <form
          action=""
          className="absolute bottom-4 inset-x-3 "
          onSubmit={(event) => sendMessage(event)}
        >
          <div className="flex relative">
            <input
              type="text"
              placeholder="Enviar mensagem"
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
              ref={currentMsg}
            />

            <button type="submit">
              <IconSend className="h-4 w-4 cursor-pointer absolute right-2 top-3" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
