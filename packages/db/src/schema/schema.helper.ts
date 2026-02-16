import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

const prefixedId =
  <T extends string>(prefix: T, size = 16) =>
  () => {
    return [prefix, nanoid(size)].join("_") as `${T}_${string}`;
  };

export const PrefixedIDs = {
  user: prefixedId("user"),
  session: prefixedId("session"),
  account: prefixedId("account"),
  verification: prefixedId("verification"),
  passkey: prefixedId("passkey"),
};
