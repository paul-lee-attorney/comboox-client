import { readContract } from "@wagmi/core";
import { HexType } from "../interfaces";
import { BigNumber } from "ethers";
import { generalKeeperABI } from "../generated";

export async function regNumOfCompany(addr: HexType):Promise<BigNumber> {
  let regNum: BigNumber = await readContract({
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
    args: [BigNumber.from(title)]
  })

  return keeper;
}

export async function getBook(addr: HexType, title: number):Promise<HexType> {
  let keeper: HexType = await readContract({
    address: addr,
    abi: generalKeeperABI,
    functionName: 'getBook',
    args: [BigNumber.from(title)]
  })

  return keeper;
}

export async function getBoox(gk: HexType): Promise<HexType[]>{
  let books: HexType[] = [];
  books.push(gk);

  for (let i = 1; i<10; i++) {
    let temp: HexType = await getBook(gk, i);
    books.push(temp);
  }
  return books;  
}
