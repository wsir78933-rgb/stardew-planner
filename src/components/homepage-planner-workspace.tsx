"use client";

import { useEffect } from "react";
import { ReferenceRuntimeHost } from "./reference-runtime-host";

export function HomepagePlannerWorkspace() {
  useEffect(() => {
    document.body.classList.add("stardew-homepage");

    return () => {
      document.body.classList.remove("stardew-homepage");
    };
  }, []);

  return (
    <section data-homepage-workspace id="planner">
      <ReferenceRuntimeHost />
    </section>
  );
}
