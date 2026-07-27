export function ReferenceRuntimeHost() {
  return (
    <>
      <div id="reference-runtime-root" suppressHydrationWarning />
      <script type="module" src="/reference-runtime/bootstrap.mjs" />
    </>
  );
}
