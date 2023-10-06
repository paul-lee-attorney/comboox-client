import { Bytes32Zero, HexType } from "../common";
import { readContract } from "@wagmi/core";
import { registerOfPledgesABI } from "../../generated";


export const statesOfInvestor = [
  'Pending',
  'Approved',
  'Revoked'
]

export const statesOfOrder = [
  'Active',
  'Closed',
  'Terminated'
]

export interface InitOffer{
  seqOfOrder: number;
  classOfShare: number;
  seqOfShare: number;
  execHours: number;
  paid: bigint;
  price: number;
  seqOfLR: number;
}

export const defaultOffer: InitOffer = {
  seqOfOrder: 0,
  classOfShare: 0,
  seqOfShare: 0,
  execHours: 0,
  paid: BigInt(0),
  price: 0,
  seqOfLR: 1024,
}

export interface Order {
  prev: number;
  next: number;
  seqOfShare: number;
  paid: bigint;
  price: number;
  expireDate: number;
  votingWeight: number;
}

export interface OrderWrap {
  seq: number;
  node: Order;
}

export const defaultOrder: Order = {
  prev: 0,
  next: 0,
  seqOfShare: 0,
  paid: BigInt(0),
  price: 0,
  expireDate: 0,
  votingWeight: 0,
}

export const defaultOrderWrap: OrderWrap = {
  seq: 0,
  node: defaultOrder,
}

export interface Investor {
  userNo: number;
  groupRep: number;
  regDate: number;
  verifier: number;
  approveDate: number;
  state: number;
  idHash: HexType;
}

export interface Deal {
  classOfShare: number;
  seqOfShare: number;
  buyer: number;
  groupRep: number;
  paid: bigint;
  price: number;
  votingWeight: number;
}

export const defaultDeal: Deal = {
  classOfShare: 0,
  seqOfShare: 0,
  buyer: 0,
  groupRep: 0,
  paid: BigInt(0),
  price: 0,
  votingWeight: 0,
}


