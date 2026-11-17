import Stripe from "stripe";
import { stripeConfig } from "./config";

let client: Stripe | undefined;

export function stripe() {
  client ??= new Stripe(stripeConfig().secretKey);
  return client;
}
