import Stripe from "stripe";
import { stripeSecretKey } from "./config";

let client: Stripe | undefined;

export function stripe() {
  client ??= new Stripe(stripeSecretKey());
  return client;
}
