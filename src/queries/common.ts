import { waitForTransaction } from "@wagmi/core";
import { HexType } from "../interfaces";

export async function getReceipt(hash: HexType): Promise< any > {
  const res = await waitForTransaction({
    hash: hash
  });
  return res;
}