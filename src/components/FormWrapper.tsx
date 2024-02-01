"use client";

import { useState } from "react";

import Join from "./Join";
import Create from "./Create";

export default function FormWrapper() {
  const [selectedRoom, setSelectedRoom] = useState<"join" | "create">("join");

  const handleSelectRoom = (room: "join" | "create") => {
    setSelectedRoom(room);
  };

  return (
    <div className="w-full">
      <div className="flex items-center text-center">
        <span
          className={`w-1/2 cursor-pointer ${
            selectedRoom === "join" &&
            "p-4 rounded-t-lg text-primary bg-secondary"
          }`}
          onClick={() => handleSelectRoom("join")}
        >
          Ingressar
        </span>

        <span
          className={`w-1/2 cursor-pointer ${
            selectedRoom === "create" &&
            "p-4 rounded-t-lg text-primary bg-secondary"
          }`}
          onClick={() => handleSelectRoom("create")}
        >
          Nova reunião
        </span>
      </div>

      <div className="bg-secondary rounded-b-lg space-y-8 p-10">
        <RoomSelector selectedRoom={selectedRoom} />
      </div>
    </div>
  );
}

const RoomSelector = ({
  selectedRoom,
}: {
  selectedRoom: "join" | "create";
}) => {
  switch (selectedRoom) {
    case "join":
      return <Join />;
    case "create":
      return <Create />;
    default:
      return <Join />;
  }
};
