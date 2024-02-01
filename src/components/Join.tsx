"use client";

import { FormEvent, useRef } from "react";

import Button from "./Button";
import Input from "./Input";

export default function Join() {
  const name = useRef<HTMLInputElement>(null);
  const id = useRef<HTMLInputElement>(null);

  function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      name.current &&
      name.current.value !== "" &&
      id.current &&
      id.current.value
    ) {
      sessionStorage.setItem("@talktome:username", name.current.value);
      sessionStorage.setItem("@talktome:roomId", id.current.value);

      window.location.href = `/room/${id.current.value}`;
    } else {
      window.alert("Por favor, informe seu nome e o ID da reunião.");
    }
  }

  return (
    <form onSubmit={(event) => handleJoinRoom(event)} className="space-y-8">
      <Input placeholder="Seu nome" type="text" ref={name} />
      <Input placeholder="Seu ID da reunião" type="text" ref={id} />
      <Button title="Entrar" type="submit" />
    </form>
  );
}
