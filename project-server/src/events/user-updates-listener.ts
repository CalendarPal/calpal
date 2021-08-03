import { PubSub } from "@google-cloud/pubsub";

import User from "../entities/User";
import { DecodedMessage, PubSubListener } from "./pub-sub-listener";

interface UserUpdatesData {
  uid: string;
  email: string;
  name: string;
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
    const {
      uid: uid,
      email: email,
      name: name,
      createdAt: createdAt,
    } = msg.data;
    console.log(msg.data);
    try {
      let user = await User.findOne({ id: uid });
      console.log(typeof user);
      if (typeof user !== "undefined") {
        user.email = email;
        user.name = name;
        user.createdAt = createdAt;
        await user.save();
      } else {
        user = new User({
          id: uid,
          email: email,
          name: name,
        });
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
