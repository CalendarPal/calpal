import { CreateSubscriptionOptions, Message, PubSub, Subscription } from '@google-cloud/pubsub';

import { InternalError } from '../errors/internal-error';

export interface DecodedMessage<T> {
  type: string;
  data: T;
  ack(): void;
  nack(): void;
}

export abstract class PubSubListener<T> {
  abstract topicName: string;
  abstract onMessage(msg: DecodedMessage<T>): void;

  protected pubSubClient: PubSub;
  private _subscriptionName?: string;
  subscription?: Subscription;

  constructor(pubSubClient: PubSub) {
    this.pubSubClient = pubSubClient;
  }

  async init(subscriptionName: string, options?: CreateSubscriptionOptions) {
    const [exists] = await this.pubSubClient
      .subscription(subscriptionName)
      .exists();
    this._subscriptionName = subscriptionName;

    if (exists) {
      this.subscription = this.pubSubClient.subscription(
        this._subscriptionName
      );
    } else {
      const [subscription] = await this.pubSubClient
        .topic(this.topicName)
        .createSubscription(this._subscriptionName, options);
      this.subscription = subscription;
    }
  }

  listen() {
    if (!this.subscription) {
      throw new InternalError(
        "You must initialize a subscription for this process"
      );
    }

    this.subscription.on("message", (rawMsg: Message) => {
      let parsedData: T;

      try {
        parsedData = JSON.parse(rawMsg.data.toString()) as T;
      } catch (err) {
        console.log("Error receiving and parsing incoming data: ", err);
        throw new InternalError("Unable to receive incoming message");
      }

      console.log(
        `Message received and parsed. Type: ${rawMsg.attributes.type}, Data: ${parsedData}`
      );

      this.onMessage({
        type: rawMsg.attributes.type,
        data: parsedData,
        ack: () => rawMsg.ack(),
        nack: () => rawMsg.nack(),
      });
    });
  }
}
