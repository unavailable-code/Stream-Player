import UrlCard from "./_components/url-card";
import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import KeyCard from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";

const KeysPage = async () => {
  const self = await getSelf();
  const stream = await getStreamByUserId(self.id);
  if (!stream) {
    throw new Error("Stream not found");
  }
  return (
    <div className="p-10 min-h-screen w-full bg-black overflow-hidden text-white ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Keys & URLs</h1>
        <ConnectModal />
      </div>
      <div className="space-y-4">
        <UrlCard value={stream.serverUrl} />
        <KeyCard value={stream.streamKey} />
      </div>
    </div>
  );
};

export default KeysPage;
