import Image from "next/image";
import { AuthForm } from "./auth-form";
export function AuthShell({ register = false }: { register?: boolean }) {
  return (
    <div className="container auth-page">
      <div className="auth-visual">
        <Image
          src="/images/hero.jpg"
          alt="The open road awaits"
          fill
          sizes="50vw"
        />
        <div className="auth-visual-shade" />
        <div>
          <span className="eyebrow">GOOD THINGS START HERE</span>
          <h2>
            A new journey.
            <br />A little more
            <br />
            possibility.
          </h2>
          <p>
            Your vehicle could be someone’s
            <br />
            favourite part of the trip.
          </p>
        </div>
      </div>
      <section className="auth-panel">
        <div className="eyebrow">
          {register ? "JOIN THE JOURNEY" : "WELCOME BACK"}
        </div>
        <h1>
          {register
            ? "Put your vehicle\non the map."
            : "Let’s get you\nback on the road."}
        </h1>
        <p>
          {register
            ? "Create your free account and start connecting with renters."
            : "Log in to manage your vehicles and catch up on inquiries."}
        </p>
        <AuthForm register={register} />
      </section>
    </div>
  );
}
