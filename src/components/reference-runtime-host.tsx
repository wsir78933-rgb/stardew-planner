"use client";

import dynamic from "next/dynamic";

const ReferenceRuntimeClientRoot = dynamic(
  () =>
    import("./reference-runtime-client-root").then(
      ({ ReferenceRuntimeClientRoot }) => ReferenceRuntimeClientRoot,
    ),
  { ssr: false },
);

export function ReferenceRuntimeHost() {
  return <ReferenceRuntimeClientRoot />;
}
