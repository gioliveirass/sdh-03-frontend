import Image from "next/image";
import Container from "./Container";

export default function Header() {
  return (
    <section id="header" className=" bg-gray-1000 p-4">
      <Container>
        <div className="flex justify-between">
          <Image
            alt="Talk To Me!"
            src="/logo_app.svg"
            width={120}
            height={120}
          />

          <Image
            alt="Hero Code"
            src="/logo_herocode.svg"
            width={60}
            height={60}
          />
        </div>
      </Container>
    </section>
  );
}
