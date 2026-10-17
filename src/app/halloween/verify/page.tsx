import { Suspense } from "react";
import HalloweenVerifyClient from "./HalloweenVerifyClient";

export default function HalloweenVerifyPage() {
  return (
    <Suspense
      fallback={
        <section
          className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
          style={{ backgroundImage: "linear-gradient(180deg, #13070d 0%, #080305 44%, #050205 100%)" }}
        >
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
            <p className="font-playfair text-4xl font-bold text-foreground sm:text-5xl">Verifying your vote</p>
            <p className="mx-auto mt-4 max-w-2xl font-outfit text-base leading-8 text-foreground/75 sm:text-lg">Checking your verification link...</p>
          </div>
        </section>
      }
    >
      <HalloweenVerifyClient />
    </Suspense>
  );
}
