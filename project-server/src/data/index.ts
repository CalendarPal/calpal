import { PubSub } from "@google-cloud/pubsub";

export interface DataSources {
  pubSubClient: PubSub;
}

export const initDS = async (): Promise<DataSources> => {
  const pubSubClient = new PubSub();

  return {
    pubSubClient,
  };
};
