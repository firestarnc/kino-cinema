"use client";

import dynamic from "next/dynamic";
import React from "react";

const DynamicMoviePackage = dynamic(() => import("./MoviePackageClient"), {
  ssr: false,
  loading: () => (
    <div className="mt-8 animate-pulse" aria-hidden>
      <div className="h-10 w-full rounded-md bg-secondary/40" />
    </div>
  ),
});

export default function ClientMount() {
  return <DynamicMoviePackage />;
}
