import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { filesFolderABI } from "../generated";
import { BigNumber } from "ethers";

export interface Head {
  circulateDate: number;
  signingDays: number;
  closingDays: number;
  seqOfVR: number;
  shaExecDays: number;
  shaConfirmDays: number;
  proposeDate: number;
  reconsiderDays: number;
  votePrepareDays: number;
  votingDays: number;
  execDaysForPutOpt: number;
  seqOfMotion: BigNumber;
  state: number;
}

export interface Ref {
  docUrl: HexType;
  docHash: HexType; 
}

export interface File {
  snOfDoc: HexType;
  head: Head;
  ref: Ref;
}

export async function signingDeadline(folder: HexType, body: HexType):Promise<number>{
  let deadline: number = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'signingDeadline',
    args: [ body ],
  })

  return deadline;
}

export async function closingDeadline(folder: HexType, body: HexType):Promise<number>{
  let deadline: number = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'closingDeadline',
    args: [ body ],
  })

  return deadline;
}

export async function shaExecDeadline(folder: HexType, body: HexType):Promise<number>{
  let deadline: number = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'shaExecDeadline',
    args: [ body ],
  })

  return deadline;
}

export async function proposeDeadline(folder: HexType, body: HexType):Promise<number>{
  let deadline: number = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'proposeDeadline',
    args: [ body ],
  })

  return deadline;
}

export async function votingDeadline(folder: HexType, body: HexType):Promise<number>{
  let deadline: number = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'votingDeadline',
    args: [ body ],
  })

  return deadline;
}

export async function qtyOfFiles(folder: HexType, body: HexType):Promise<BigNumber>{
  let qty: BigNumber = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'qtyOfFiles',
  })

  return qty;
}

export async function getFile(folder: HexType, body: HexType):Promise<File>{
  let file: File = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getFile',
    args: [ body ],
  })

  return file;
}

export async function getFilesList(folder: HexType):Promise<readonly HexType[]> {

  let list: readonly HexType[] = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getFilesList',
  })

  return list;
}

export async function isRegistered(folder: HexType, body: HexType):Promise<boolean>{
  let flag: boolean = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'isRegistered',
    args: [ body ],
  })

  return flag;
}

export async function getSnOfFile(folder: HexType, body: HexType):Promise<HexType>{
  let sn: HexType = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getSNOfFile',
    args: [ body ],
  })

  return sn;
}

export async function getHeadOfFile(folder: HexType, addrOfFile: HexType): Promise<Head> {

  let res = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getHeadOfFile',
    args: [ addrOfFile ],
  })

  return res;
}

export async function getRefOfFile(folder: HexType, addrOfFile: HexType): Promise<Ref> {

  let ref = await readContract({
    address: folder,
    abi: filesFolderABI,
    functionName: 'getRefOfFile',
    args: [ addrOfFile ],
  })

  return ref;
}
