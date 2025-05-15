
import { parseAbiItem } from "viem";
import { HexType } from ".";
import { delay } from "./toolsKit";
import { PublicClient } from "wagmi";


interface FetchLogsParams {
  address: HexType | HexType[];
  eventAbiString: string;
  args?: Record<string, any>;
  fromBlkNum: bigint;
  toBlkNum: bigint;
  client: PublicClient;
};

export const fetchLogs = async ({
  address,
  eventAbiString,
  args = {},
  fromBlkNum,
  toBlkNum,
  client,
}:FetchLogsParams): Promise<any[]> => {
  
  let allLogs:any[] = [];
  let currentBlk = fromBlkNum;
  
  const eventFilter = parseAbiItem(eventAbiString);

  if (eventFilter.type !== "event") {
    throw new Error("Provided ABI is not an event.");
  }

  while (currentBlk <= toBlkNum) {
    const endBlk = currentBlk + 499n > toBlkNum ? toBlkNum : currentBlk + 499n;
    let retries = 0;
    let success = false;

    while (!success && retries <= 5) {
      try {
        const logs = await client.getLogs({
          address,
          event: eventFilter,
          args,
          fromBlock: currentBlk,
          toBlock: endBlk,
        });

        console.log('obtained logs:', logs);

        allLogs = [...allLogs, ...logs];
        currentBlk = endBlk + 1n;
        success = true;
        
        await delay(500);

      } catch (error:any) {
        if (retries < 5) {
          console.warn(`Rate limited. Retrying in 500 ms...`);
          await delay(500);
          retries++;
          continue;
        } else {
          throw new Error(`Failed after ${retries} retries: ${error.message}`);
        }
      }
    }

    if (!success) {
      throw new Error(`Block range ${currentBlk}-${endBlk} failed after ${5} retries`);
    }
  }

  return allLogs;
};


