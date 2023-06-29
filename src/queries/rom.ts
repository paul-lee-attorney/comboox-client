import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { registerOfMembersABI } from "../generated";
import { BigNumber } from "ethers";


export async function getShareNumbersList(addr: HexType): Promise<readonly HexType[]> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'sharesList',
  });

  return res;
}

export async function getControllor(addr: HexType): Promise<number> {
  let acct:number = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'controllor',
  });

  return acct;
}

export async function getVotesOfController(addr: HexType): Promise<BigNumber> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'votesOfController',
  });

  return res;
}


export interface ShareClip {
  timestamp: number;
  paid: BigNumber;
  par: BigNumber;
  cleanPaid: BigNumber;
}

export interface MemberShareClip {
  acct: BigNumber;
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

export async function getMembersList(addr: HexType): Promise<readonly BigNumber[]> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'membersList',
  });

  return res;
}

export async function getShareClipOfMember(addr: HexType, acct: BigNumber): Promise<ShareClip> {
  let res = await readContract({
    address: addr,
    abi: registerOfMembersABI,
    functionName: 'sharesClipOfMember',
    args: [ acct ],
  });

  return res;
}

export async function getEquityList(rom: HexType, members: readonly BigNumber[]): Promise<MemberShareClip[]> {

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





