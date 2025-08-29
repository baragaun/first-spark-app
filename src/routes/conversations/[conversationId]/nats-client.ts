import type { ChannelMessage } from "@baragaun/bg-node-client";
import { connect, StringCodec, type NatsConnection } from "nats.ws";

const sc = StringCodec();

let nc: NatsConnection | null = null;

export async function connectToNats() {
  if (!nc) {
    nc = await connect({ servers: "ws://localhost:8080" });
    console.log("[NATS] Connected!");
  }
  return nc;
}

export async function subscribeToChannel(channelId: string, callback: (msg: ChannelMessage, operation: string) => void) {
  const nc = await connectToNats();
  const subject = `first.spark.dev.channel.${channelId}.messages`;

  const sub = nc.subscribe(subject);

  (async () => {
    try {
    for await (const m of sub) {
      const messageStr = sc.decode(m.data);
      const parsed = JSON.parse(messageStr);

    // Check if this is a ChannelMessage
    if (parsed.modelType === "ChannelMessage") {
      const channelMessage = parsed.object;
      callback(channelMessage as ChannelMessage, parsed.changeType );
      } else {
        console.debug("Received non-channel message:", parsed);
      }
    }
  } catch (err) {
    console.error("[NATS] Subscription error:", err);
  }
  })();
}
