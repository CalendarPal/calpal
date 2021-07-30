import { PubSub } from "@google-cloud/pubsub";
import User from "../entities/User";
import { DecodedMessage, PubSubListener } from "./pub-sub-listener";

interface UserUpdatesData {
  uid: string;
  email: string;
  createdAt: Date;
}

interface UserUpdatesListenerOptions {
  pubSub: PubSub;
}

export class UserUpdatesListener extends PubSubListener<UserUpdatesData> {
  readonly topicName = "events";

  constructor(options: UserUpdatesListenerOptions) {
    super(options.pubSub);
  }

  async onMessage(msg: DecodedMessage<UserUpdatesData>): Promise<void> {
    const { uid, email } = msg.data;
    console.log(msg.data);
    try {
      let user = await User.findOne({ id: uid });
      if (user) {
        user.email = msg.data.email;
        user.createdAt = msg.data.createdAt;
        await user.save();
      } else {
        user = new User({ id: uid, email });
        await user.save();
      }
    } catch (err) {
      console.error(
        `Error creating or updating user for userId: ${msg.data.uid}`,
        err
      );
      msg.nack();
    }
    msg.ack();
  }
}
