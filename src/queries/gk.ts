import { readContract } from "@wagmi/core";
import { AddrZero, HexType } from "../interfaces";
import { generalKeeperABI } from "../generated";
import { getDK, getOwner } from "./accessControl";

export const nameOfBooks = [
  'GK', 'ROC', 'ROD', 'BMM', 'ROM', 'GMM', 
  'ROA', 'ROO', 'ROP', 'BOS', 'ROS'
]

export const titleOfKeepers = [
  'GK', 'RocKeeper', 'RodKeeper', 'BmmKeeper', 'RomKeeper', 'GmmKeeper', 
  'RoaKeeer', 'RooKeeper', 'RopKeeper', 'RosKeeper', 'ShaKeeper'
]

export async function regNumOfCompany(addr: HexType):Promise<bigint> {
  let regNum: bigint = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'regNumOfCompany',
  })

  return regNum;
}

export async function nameOfCompany(addr: HexType):Promise<string> {
  let name: string = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'nameOfCompany',
  })

  return name;
}

export async function symbolOfCompany(addr: HexType):Promise<string> {
  let symbol: string = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'symbolOfCompany',
  })

  return symbol;
}

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


