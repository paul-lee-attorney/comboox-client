import { readContract } from "@wagmi/core";
import { HexType } from "../common";
import { registerOfMembersABI } from "../../generated";

export interface ShareClip {
  timestamp: number;
  votingWeight: number;
  paid: bigint;
  par: bigint;
  cleanPaid: bigint;
}

export interface MemberShareClip {
  acct: bigint;
  sharesInHand: readonly HexType[];
  clip: ShareClip;
}

export async function getOwnersEquity(addr: HexType): Promise<ShareClip> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'ownersEquity',
  });

  return res;
}

export async function getMembersList(addr: HexType): Promise<readonly bigint[]> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'membersList',
  });

  return res;
}

export async function getEquityOfMember(addr: HexType, acct: bigint): Promise<ShareClip> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'equityOfMember',
    args: [ acct ],
  });

  return res;
}

export async function sharesInHand(addr: HexType, acct: bigint): Promise<readonly HexType[]> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'sharesInHand',
    args: [ acct ],
  });

  return res;
}

export async function getEquityList(rom: HexType, members: readonly bigint[]): Promise<MemberShareClip[]> {

  let list: MemberShareClip[] = [];
  let len: number = members.length;
  let i=0;

  while(i < len) {

    let item: ShareClip = await getEquityOfMember(rom, members[i]);
    let shares = await sharesInHand(rom, members[i]); 

    list[i] = {
      acct: members[i],
      sharesInHand: shares,
      clip: item,
    };

    i++;

  }

  return list;
}

export async function votesOfGroup(rom: HexType, acct: bigint): Promise<bigint>{
  let res = await readContract({
    address: rom,
    abi: registerOfMembersABI,
    functionName: 'votesOfGroup',
    args: [ acct ],
  });

  return res;
}



