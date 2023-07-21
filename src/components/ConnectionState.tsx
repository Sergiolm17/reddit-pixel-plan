
export function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return <p>{isConnected ? "Connected" : "Not Connected"}</p>;
}