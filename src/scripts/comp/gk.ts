import { readContract, fetchBalance } from "@wagmi/core";
import { HexType } from "../common";
import { generalKeeperABI } from "../../generated";
import { getDK, getOwner } from "../common/accessControl";
import { toStr } from "../common/toolsKit";

export const nameOfBooks = [
  'GK', 'ROC', 'ROD', 'BMM', 'ROM', 'GMM', 
  'ROA', 'ROO', 'ROP', 'ROS', 'LOO'
]

export const titleOfKeepers = [
  'GK', 'RocKeeper', 'RodKeeper', 'BmmKeeper', 'RomKeeper', 'GmmKeeper', 
  'RoaKeeer', 'RooKeeper', 'RopKeeper', 'ShaKeeper', 'LooKeeper'
]

export async function getKeeper(addr: HexType, title: number):Promise<HexType> {
  let keeper: HexType = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'getKeeper',
    args: [BigInt(title)]
  })

  return keeper;
}

export async function getBook(addr: HexType, title: number):Promise<HexType> {
  let keeper: HexType = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'getBook',
    args: [BigInt(title)]
  })

  return keeper;
}

export interface BookInfo {
  title: number;
  addr: HexType;
  owner: HexType;
  dk: HexType;
}

export async function getBoox(gk: HexType): Promise<BookInfo[]>{
  let books: BookInfo[] = [];

  books.push({
    title: 0,
    addr: gk,
    owner: await getOwner(gk),
    dk: await getDK(gk),
  })

  for (let i = 1; i<11; i++) {
 
    let addr = await getBook(gk, i);
    let owner = await getOwner(addr); 
    let dk = await getDK(addr);
 
    let item: BookInfo = {
      title: i,
      addr: addr,
      owner: owner,
      dk: dk,    
    }

    books.push(item);
  }
  return books;  
}


export async function getKeepers(gk: HexType):Promise<BookInfo[]>{
  let books: BookInfo[] = [];

  books.push({
    title: 0,
    addr: gk,
    owner: await getOwner(gk),
    dk: await getDK(gk),
  })

  for (let i = 1; i<11; i++) {
 
    let addr = await getKeeper(gk, i);
    let owner = await getOwner(addr);
    let dk = await getDK(addr);
 
    let item: BookInfo = {
      title: i,
      addr: addr,
      owner: owner,
      dk: dk,    
    }

    books.push(item);
  }
  return books;  
}

export async function getSHA(gk: HexType):Promise<HexType>{
  return await readContract({
    address: gk,
    abi: generalKeeperABI,
    functionName: 'getSHA'
  });
}

export interface CompInfo {
  regNum: number;
  regDate: number;
  currency: number;
  symbol: string;
  name: string;
}

export async function getCompInfo(gk: HexType):Promise<CompInfo>{

  let res = await readContract({
    address: gk,
    abi: generalKeeperABI,
    functionName: 'getCompInfo',
  })

  let info:CompInfo = {
    regNum: res.regNum,
    regDate: res.regDate,
    currency: res.currency,
    symbol: toStr(Number(res.symbol)),
    name: res.name    
  }

  return info;
}

export async function balanceOfGwei(gk: HexType):Promise<bigint>{
  let res = await fetchBalance({
    address: gk,
    formatUnits: 'gwei'
  })

  return res.value;
}

export async function getCentPrice(gk: HexType):Promise<bigint>{
  let res = await readContract({
    address: gk,
    abi: generalKeeperABI,
    functionName: 'getCentPrice',
  })

  return res;
}

