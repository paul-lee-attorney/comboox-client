import { readContract, fetchBalance } from "@wagmi/core";
import { HexType } from "../../../read";
import { payrollOfProjectABI } from "../../../../../generated";

// ==== Member ====

export interface Member {
  seqOfTeam: number;
  userNo: number;
  state: number;
  rate: number;
  estimated: number;
  applied: number;
  budgetAmt: number;
  pendingAmt: number;
  receivableAmt: number;
  paidAmt: number;
}

export interface BalanceOf {
  project: bigint;
  cash: bigint;
  me: bigint;
}

export async function getOwner(addrOfPop:HexType): Promise<HexType>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getOwner'
  });

  return res;
}

export async function getRegCenter(addrOfPop:HexType): Promise<HexType>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getRegCenter'
  });

  return res;
}

export async function getCurrency(addrOfPop:HexType): Promise<number>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getCurrency'
  });

  return res;
}

export async function isManager(addrOfPop:HexType, acct: bigint): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'isManager',
    args: [acct]
  });

  return res;
}

export async function getProjectInfo(addrOfPop:HexType): Promise<Member>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getProjectInfo',
  });

  return res;
}

// ---- Teams ----

export async function qtyOfTeams(addrOfPop:HexType): Promise<number>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'qtyOfTeams',
  });

  return Number(res);
}

export async function getListOfTeams(addrOfPop:HexType): Promise<number[]>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getListOfTeams',
  });

  return res.map(v => Number(v.toString())) ;
}

export async function teamIsEnrolled(addrOfPop:HexType, seqOfTeam: number): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'teamIsEnrolled',
    args: [ BigInt(seqOfTeam) ]
  });

  return res;
}

// ---- TeamInfo ----

export async function isTeamLeader(
  addrOfPop:HexType,
  acct: number, 
  seqOfTeam: number
): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'isTeamLeader',
    args: [ BigInt(acct), BigInt(seqOfTeam) ]
  });

  return res;
}

export async function getTeamInfo(addrOfPop:HexType, seqOfTeam: number): Promise<Member>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getTeamInfo',
    args: [ BigInt(seqOfTeam) ]
  });

  return res;
}

export async function getTeamInfoList(addrOfPop:HexType): Promise<Member[]>{
  let ls = await getListOfTeams(addrOfPop);
  let len = ls.length;
  let output:Member[] = [];

  while (len > 0) {
    let m = await getTeamInfo(addrOfPop, ls[len-1]);
    output.push(m);
    len--;
  }

  return output;
}

// ---- Member ----

export async function isMember(
  addrOfPop:HexType,
  acct: number, 
  seqOfTeam: number
): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'isMember',
    args: [ BigInt(acct), BigInt(seqOfTeam) ]
  });

  return res;
}

export async function isEnrolledMember(
  addrOfPop:HexType,
  acct: number, 
  seqOfTeam: number
): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'isEnrolledMember',
    args: [ BigInt(acct), BigInt(seqOfTeam) ]
  });

  return res;
}

export async function getTeamMembersList(addrOfPop:HexType, seqOfTeam: number): Promise<number[]>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getTeamMembersList',
    args: [ BigInt(seqOfTeam) ]
  });

  return res.map(v => Number(v.toString()));
}

export async function getMemberInfo(
  addrOfPop:HexType,
  acct: number, 
  seqOfTeam: number
): Promise<Member>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getMemberInfo',
    args: [ BigInt(acct), BigInt(seqOfTeam) ]
  });

  return res;
}

export async function getMembersOfTeam(addrOfPop:HexType, seqOfTeam: number): Promise<readonly Member[]>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getMembersOfTeam',
    args: [ BigInt(seqOfTeam) ]
  });

  return res;
}

// ---- Payroll ----

export async function getPayroll(addrOfPop:HexType): Promise<number[]>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getPayroll',
  });

  return res.map(v => Number(v.toString()));
}

export async function inPayroll(addrOfPop:HexType, acct: number): Promise<boolean>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'inPayroll',
    args: [BigInt(acct)],
  });

  return res;
}

export async function getBalanceOf(addrOfPop:HexType, acct: number): Promise<bigint>{

  let res = await readContract({
    address: addrOfPop,
    abi: payrollOfProjectABI,
    functionName: 'getBalanceOf',
    args: [BigInt(acct)],
  });

  return res;
}

export async function balanceOfWei(addr: HexType):Promise<bigint>{
  let res = await fetchBalance({
    address: addr,
    formatUnits: 'wei'
  })

  return res.value;
}

