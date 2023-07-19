import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { bookOfMembersABI } from "../generated";

export async function getShareNumbersList(addr: HexType): Promise<readonly HexType[]> {
  let res = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'sharesList',
  });

  return res;
}

export async function getControllor(addr: HexType): Promise<number> {
  let acct:number = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'controllor',
  });

  return acct;
}

export async function getVotesOfController(addr: HexType): Promise<bigint> {
  let res = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'votesOfController',
  });

  return res;
}


export interface ShareClip {
  timestamp: number;
  paid: bigint;
  par: bigint;
  cleanPaid: bigint;
}

export interface MemberShareClip {
  acct: bigint;
  clip: ShareClip;
}

export async function getOwnersEquity(addr: HexType): Promise<ShareClip> {
  let res = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'ownersEquity',
  });

  return res;
}

export async function getMembersList(addr: HexType): Promise<readonly bigint[]> {
  let res = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'membersList',
  });

  return res;
}

export async function getShareClipOfMember(addr: HexType, acct: bigint): Promise<ShareClip> {
  let res = await readContract({
    address: addr,
    abi: bookOfMembersABI,
    functionName: 'sharesClipOfMember',
    args: [ acct ],
  });

  return res;
}

export async function getEquityList(rom: HexType, members: readonly bigint[]): Promise<MemberShareClip[]> {

  let list: MemberShareClip[] = [];
  let len: number = members.length;
  let i=0;

  while(i < len) {

    let item: ShareClip = await getShareClipOfMember(rom, members[i]);

    list[i] = {
      acct: members[i],
      clip: item,
    };

    i++;

  }

  return list;
}





