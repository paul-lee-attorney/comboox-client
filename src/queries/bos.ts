import { HexType } from "../interfaces";
import { readContract } from "@wagmi/core";
import { bookOfSharesABI } from "../generated";

export interface Head {
  seqOfShare: number; // 股票序列号
  preSeq: number; // 前序股票序列号（股转时原标的股序列号）
  class: number; // 股票类别/轮次编号
  issueDate: number; // 股票签发日期（秒时间戳）
  shareholder: number; // 股东代码
  priceOfPaid: number; // 发行价格（实缴出资价）
  priceOfPar: number; // 发行价格（认缴出资价）
}

export interface Body {
  payInDeadline: number; // 出资期限（秒时间戳）
  paid: bigint; // 实缴出资
  par: bigint; // 认缴出资（注册资本面值）
  cleanPaid: bigint; // 清洁实缴出资（扣除出质、远期、销售要约金额）
  state: number;
}

export interface Share {
  sn: HexType;
  head: Head;
  body: Body;
}

export function codifyHeadOfShare(head: Head): HexType {
  let sn: HexType = `0x${
    head.seqOfShare.toString(16).padStart(8, '0') +
    head.preSeq.toString(16).padStart(8, '0') +
    head.class.toString(16).padStart(4, '0') +
    head.issueDate.toString(16).padStart(12, '0') +
    head.shareholder.toString(16).padStart(10, '0') +
    head.priceOfPaid.toString(16).padStart(8, '0') +
    head.priceOfPar.toString(16).padStart(8, '0') +
    '0'.padStart(6, '0')
  }`;
  return sn;
}

export function parseSnOfShare(sn: HexType): Head {
  let head: Head = {
    seqOfShare: parseInt(sn.substring(2, 10), 16),
    preSeq: parseInt(sn.substring(10, 18), 16),
    class: parseInt(sn.substring(18, 22), 16),
    issueDate: parseInt(sn.substring(22, 34), 16),
    shareholder: parseInt(sn.substring(34, 44), 16),
    priceOfPaid: parseInt(sn.substring(44, 52), 16),
    priceOfPar: parseInt(sn.substring(52, 60), 16),
  };

  return head
}

export async function getShare(bos: HexType, seq: number): Promise<Share> {

  let share = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'getShare',
    args: [BigInt(seq)],
  });

  let shareWrap:Share = {
    sn: codifyHeadOfShare(share.head),
    head: share.head,
    body: share.body,
  } 

  return shareWrap;
}

export async function getSharesList(bos: HexType, snList: readonly HexType[]): Promise<Share[]> {

  let list: Share[] = [];
  let len: number = snList.length;
  let i = 0;

  while(i < len) {

    let seq: number = parseSnOfShare(snList[i]).seqOfShare;

    list[i] = await getShare(bos, seq);
    i++;
  }

  return list;
}

export async function counterOfShares(bos: HexType): Promise<number>{

  let counter = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'counterOfShares',
  })

  return counter;
}

export async function counterOfClasses(bos: HexType): Promise<number>{

  let counter = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'counterOfClasses',
  })

  return counter;
}

export async function isShare(bos: HexType, seqOfShare: number): Promise<boolean>{

  let flag = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'isShare',
    args: [BigInt(seqOfShare)],
  })

  return flag;
}

export async function getHeadOfShare(bos: HexType, seqOfShare: number): Promise<Head>{

  let head = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'getHeadOfShare',
    args: [BigInt(seqOfShare)],
  })

  return head;
}

export async function getBodyOfShare(bos: HexType, seqOfShare: number): Promise<Body>{

  let body = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'getBodyOfShare',
    args: [BigInt(seqOfShare)],
  })

  return body;
}

export async function getSharesOfClass(bos: HexType, classOfShare: number): Promise<number[]>{

  let seqList = await readContract({
    address: bos,
    abi: bookOfSharesABI,
    functionName: 'getSharesOfClass',
    args: [ BigInt(classOfShare) ],
  })

  let list: number[] = [];

  seqList.forEach(v => {
    list.push(Number(v));
  })

  return list;
}

