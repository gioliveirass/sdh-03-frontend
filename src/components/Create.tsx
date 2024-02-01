"use client";

import { FormEvent, useRef } from "react";

import Button from "./Button";
import Input from "./Input";

export default function Create() {
  const name = useRef<HTMLInputElement>(null);

  function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.current && name.current.value !== "") {
      const roomId = generateRandomString();

      sessionStorage.setItem("@talktome:username", name.current.value);
      sessionStorage.setItem("@talktome:roomId", roomId);

      window.location.href = `/room/${roomId}`;
    } else {
      window.alert("Por favor, informe seu nome.");
    }
  }

  function generateRandomString() {
    return Math.random().toString(36).substring(2, 7);
  }

  return (
    <form onSubmit={(event) => handleCreateRoom(event)} className="space-y-8">
      <Input placeholder="Seu nome" type="text" ref={name} />
      <Button title="Entrar" type="submit" />
    </form>
  );
}
