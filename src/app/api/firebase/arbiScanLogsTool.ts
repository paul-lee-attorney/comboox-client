import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import fetch from 'node-fetch';
import { decodeEventLog, Hex, keccak256, Log, parseAbiItem, toHex} from 'viem';
import { db } from './firebase';
import { delay, HexParser } from '../../app/common/toolsKit';

export interface ArbiscanLog extends Omit<Log, 'blockNumber'|'logIndex'|'transactionIndex'> {
  timeStamp: string;          // 时间戳的十六进制表示
  gasPrice: string;           // Gas价格的十六进制值
  gasUsed: string;            // 消耗Gas的十六进制值
  blockNumber: string;        // 区块高度的十六进制表示
  logIndex: string;           // 日志索引的十六进制位置
  transactionIndex: string;   // 交易索引的十六进制位置
}

interface ArbiscanData {
    status: string,
    message: string,
    result: ArbiscanLog[],
}

// ===== Get Arbiscan Logs ====

export async function fetchArbiscanData(
    chainId: number,
    address:Hex,
    fromBlock:bigint, 
    toBlock:bigint,
): Promise<ArbiscanData | undefined>  {

    const url = chainId == 42161 
        ? `https://api.arbiscan.io/api?`
        : `https://api-sepolia.arbiscan.io/api?`;
  
    const api = url + 
        `module=logs&` + 
        `action=getLogs&` +
        `address=${address}&` +
        `fromBlock=${fromBlock.toString()}&` +
        `toBlock=${toBlock.toString()}&` +
        // `topic0=${topic0}&` +
        `apikey=${process.env.NEXT_PUBLIC_ARBISCAN_API_KEY}`;

  const response = await fetch(api);
  
  if (!response.ok) {
      throw new Error(`Error fetching Logs: ${response.statusText}`);
  }

  return response.json();
}

// ==== Get & Set with DB ====

// ==== TopBlk and Menue of Logs ====

// const list = [
//     {
//         title: "RegCenter",
//         address: HexParser("0x18F7AE56d1e04B95A2C50AFd528aC3FCb6F23f91"),
//         name: "Transfer",
//         abiStr:"event Transfer(address indexed from, address indexed to, uint256 indexed value)",
//     }, // RC 252801290
//     {
//         title: "FuelTank",
//         address: HexParser("0xCf7E78D11d579f9E1a5704fAB8769844cD8C8e6b"),
//         name: "Refuel",
//         abiStr: "event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)",
//     }, // FT_0 --
//     {
//         title: "FuelTank",
//         address: HexParser("0xCf7E78D11d579f9E1a5704fAB8769844cD8C8e6b"),
//         name: "WithdrawFuel",
//         abiStr: "event WithdrawFuel(address indexed owner, uint indexed amt)",
//     }, // FT_0 --
//     {
//         title: "FuelTank",
//         address: HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"),
//         name: "Refuel",
//         abiStr: "event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)",
//     }, // FT_1  --
//     {
//         title: "FuelTank",
//         address: HexParser("0x1ACCB0C9A87714c99Bed5Ed93e96Dc0E67cC92c0"),
//         name: "WithdrawFuel",
//         abiStr: "event WithdrawFuel(address indexed owner, uint indexed amt)",
//     }, // FT_1  --  
//     {
//         title: "FuelTank",
//         address: HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7"),
//         name: "Refuel",
//         abiStr: "event Refuel(address indexed buyer, uint indexed amtOfEth, uint indexed amtOfCbp)",
//     }, // FT_2 --
//     {
//         title: "FuelTank",        
//         address: HexParser("0xFE8b7e87bb5431793d2a98D3b8ae796796403fA7"),
//         name: "WithdrawFuel",
//         abiStr: "event WithdrawFuel(address indexed owner, uint indexed amt)",
//     }, // FT_2 --
//     {
//         title: "GMMKeeper",        
//         address: HexParser("0x7256b47ff39997355ecEC2deFB7C7B332FcFDd42"),
//         name: "TransferFund",
//         abiStr: "event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)"
//     }, // GMMKeeper --
//     {
//         title: "GMMKeeper",        
//         address: HexParser("0x7256b47ff39997355ecEC2deFB7C7B332FcFDd42"),
//         name: "ExecAction",
//         abiStr: "event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)"
//     }, // GMMKeeper --
//     {
//         title: "BMMKeeper",        
//         address: HexParser("0x9bf877a0950934aa53cfee14e5a1e205c6e1b3c9"),
//         name: "TransferFund",
//         abiStr: "event TransferFund(address indexed to, bool indexed isCBP, uint indexed amt, uint seqOfMotion, uint caller)"
//     }, // BMMKeeper
//     {
//         title: "BMMKeeper",        
//         address: HexParser("0x9bf877a0950934aa53cfee14e5a1e205c6e1b3c9"),
//         name: "ExecAction",
//         abiStr: "event ExecAction(address indexed targets, uint indexed values, bytes indexed params, uint seqOfMotion, uint caller)"
//     }, // BMMKeeper --
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "PickupDeposit",
//         abiStr: "event PickupDeposit(address indexed to, uint indexed caller, uint indexed amt)",
//     }, // GK
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "SaveToCoffer",
//         abiStr: "event SaveToCoffer(uint indexed acct, uint256 indexed value, bytes32 indexed reason)",
//     }, // GK
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "ReleaseCustody",
//         abiStr: "event ReleaseCustody(uint indexed from, uint indexed to, uint indexed amt, bytes32 reason)",
//     }, // GK
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "ReceivedCash",
//         abiStr: "event ReceivedCash(address indexed from, uint indexed amt)",
//     }, // GK
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "RegKeeper",
//         abiStr: "event RegKeeper(uint indexed title, address indexed keeper, address indexed dk)",
//     }, // GK
//     {
//         title: "GeneralKeeper",        
//         address: HexParser("0x68233e877575e8c7e057e83ef0d16ffa7f98984d"),
//         name: "RegBook",
//         abiStr: "event RegBook(uint indexed title, address indexed book, address indexed dk)",
//     }, // GK
//     {
//         title: "ROMKeeper", 
//         address: HexParser("0xEC20588b8d51C66c2BFaD4FB9A79673d92F6A5b0"),
//         name: "PayInCapital",
//         abiStr: "event PayInCapital(uint indexed seqOfShare, uint indexed amt, uint indexed valueOfDeal)",
//     }, // ROMKeeper --
//     {
//         title: "ROAKeeper",        
//         address: HexParser("0x883Ac1f45936bB4830FfAf8f3e0F604cB41d31D9"),
//         name: "PayOffCIDeal",
//         abiStr: "event PayOffCIDeal(uint indexed caller, uint indexed valueOfDeal)",
//     }, // ROAKeeper --
//     {
//         title: "LOOKeeper",        
//         address: HexParser("0xf7A272E6509A3c8b52e805249117d62719f55b0b"),
//         name: "CloseBidAgainstInitOffer",
//         abiStr: "event CloseBidAgainstInitOffer(uint indexed buyer, uint indexed amt)",
//     }, // LOOKeeper --
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "ForwardUsd",
//         abiStr: "event ForwardUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "ReleaseUsd",
//         abiStr: "event ReleaseUsd(address indexed from, address indexed to, uint indexed amt, bytes32 remark)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "CustodyUsd",
//         abiStr: "event CustodyUsd(address indexed from, uint indexed amt, bytes32 indexed remark)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "DistributeUsd",
//         abiStr: "event DistributeUsd(uint indexed amt)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "PickupUsd",
//         abiStr: "event PickupUsd(address indexed msgSender, uint indexed caller, uint indexed value)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "ReceiveUsd",
//         abiStr: "event ReceiveUsd(address indexed from, uint indexed amt)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x8871e3Bb5Ac263E10e293Bee88cce82f336Cb20a"),
//         name: "ReceiveUsd",
//         abiStr: "event ReceiveUsd(address indexed from, uint indexed amt)",
//     }, // Cashier_1
//     {
//         title: "Cashier",        
//         address: HexParser("0x17d9A82Cdd2471ca26f9B5D603bE808aEa41e6F1"),
//         name: "TransferUsd",
//         abiStr: "event TransferUsd(address indexed to, uint indexed amt)",
//     }, // Cashier
//     {
//         title: "Cashier",        
//         address: HexParser("0x8871e3Bb5Ac263E10e293Bee88cce82f336Cb20a"),
//         name: "TransferUsd",
//         abiStr: "event TransferUsd(address indexed to, uint indexed amt)",
//     }, // Cashier_1
//     {
//         title: "Cashier",        
//         address: HexParser("0x8871e3Bb5Ac263E10e293Bee88cce82f336Cb20a"),
//         name: "DistributeUsd",
//         abiStr: "event DistributeUsd(uint indexed amt)",
//     }, // Cashier_1
//     {
//         title: "LOU",        
//         address: HexParser("0x124FdFbEca97877B340d94924a0c068b56251A38"),
//         name: "DealClosed",
//         abiStr: "event DealClosed(bytes32 indexed deal, uint indexed consideration)",
//     }, // LOU
//     {
//         title: "LOE",        
//         address: HexParser("0xC9CB65Fa5A541456b0571734ddd413eb787A1250"),
//         name: "DealClosed",
//         abiStr: "event DealClosed(bytes32 indexed deal, uint indexed consideration)",
//     }, // LOE
// ];

export async function getTopBlkOf(
    gk:Hex, address:string,
): Promise<bigint> {

    const docRef = doc(db, gk.toLowerCase(), 'topBlkOf');

    try {
        const docSnap = await getDoc(docRef);
        const records = {...docSnap.data()} as Record<string, string>;

        const top = records[address];
        console.log(`get topBlkOf ${address}:`, top);

        return BigInt(top);
    } catch (error) {
        console.error(`Error fetching TopBlkOf ${address}:`, error);
        return 1n;
    }

}

export async function setTopBlkOf(
    gk:Hex, address:string, blkNum:bigint,
): Promise<boolean> {

  const docRef = doc(db, gk.toLowerCase(), 'topBlkOf');

  try {
    const docSnap = await getDoc(docRef);
    let records = {...docSnap.data()} as Record<string, string>;
    let topBlk = records[address];
    console.log(`previous topBlkOf ${address}:`, topBlk);

    topBlk = blkNum.toString();
    records[address] = topBlk;

    await setDoc(docRef, records);
    console.log(`updated topBlkOf ${address}:`, topBlk);

    return true;
  } catch (error: any) {
    console.error(`Error set topBlkOf ${address}:`, error);
    return false;
  }

}

// ---- Menu ----

interface EventInfo {
    title: string,
    address: Hex,
    name: string[],
    abiStr: string[],
}

export async function getMenuOfLogs(
    gk:Hex
): Promise<EventInfo[] | undefined> {
    const docRef = doc(db, gk.toLowerCase(), 'menuOfLogs');

    try {
        const docSnap = await getDoc(docRef);
        let out = docSnap.data()?.list as EventInfo[];
        return out.map(v => ({...v, address: HexParser(v.address)}));
    } catch (error) {
        console.error("Error fetching financial data: ", error);
        return undefined;
    }

}

// ==== Contents of Logs ====

export async function getLogsByMillion(
  gk:Hex, titleOfSM:string, address:Hex, name:string, million:string
): Promise<ArbiscanLog[] | undefined> {

    const docRef = doc(db, gk.toLowerCase(), 'logInfo', titleOfSM, address.toLowerCase(), name, million);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()?.records as ArbiscanLog[];
        } else {
            console.log("no Logs found!");
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching financial data: ", error);
        return undefined;   
    }

}

export async function getAllLogs(
    gk:Hex, titleOfSM:string, address:Hex, name:string,
): Promise<ArbiscanLog[] | undefined> {
  let output: ArbiscanLog[] = [];

  try {
    const millionCollRef = collection(db, gk.toLowerCase(), 'logInfo', titleOfSM, address.toLowerCase(), name);
    const millionDocsSnap = await getDocs(millionCollRef);

    if (millionDocsSnap.empty) {
      console.log('No million data exists');
      return undefined;
    }

    const millions = millionDocsSnap.docs.map(coll => coll.id).sort();

    for (const million of millions) {
      const queryData = await getLogsByMillion(gk, titleOfSM, address, name, million);
      if (queryData && queryData.length > 0) {
        output = output.concat(queryData);
      }
    }

    return output.length > 0 ? output : undefined;

  } catch (error) {
    console.error("Error fetching all logs: ", error);
    return undefined;
  }
}

export async function getNewLogs(
    gk:Hex, titleOfSM:string, address:Hex, name:string, fromBlk:bigint
): Promise<ArbiscanLog[]> {
  let output: ArbiscanLog[] = [];
  let fromMillion = Number(fromBlk / 10n ** 6n); 

  try {
    const millionCollRef = collection(db, gk.toLowerCase(), 'logInfo', titleOfSM, address.toLowerCase(), name);
    const millionDocsSnap = await getDocs(millionCollRef);

    if (millionDocsSnap.empty) {
      console.log('No million data exists');
      return output;
    }

    let millions = millionDocsSnap.docs.map(coll => Number(coll.id)).sort();
    millions = millions.filter(v => v >= fromMillion);

    for (const million of millions) {
      const queryData = await getLogsByMillion(gk, titleOfSM, address, name, million.toString());
      if (queryData && queryData.length > 0) {
        output = output.concat(queryData);
      }
    }
    output = output.length > 0 
      ? output.sort((a,b) => Number(a.blockNumber) - Number(b.blockNumber)).
        filter(v => BigInt(v.blockNumber) >= fromBlk)
      : output;

    return output;

  } catch (error) {
    console.error("Error fetching new logs: ", error);
    return [];
  }
}

// ==== Set ====

const mergeAndSort = (a: ArbiscanLog[], b: ArbiscanLog[]): ArbiscanLog[] => {
  const mergedMap = new Map<string, ArbiscanLog>();
  [...a, ...b].forEach(item => {
    mergedMap.set(item.blockNumber + item.logIndex, item);
  });

  return Array.from(mergedMap.values()).sort((x, y) => {
    if (BigInt(x.blockNumber) > BigInt(y.blockNumber)) return 1;
    if (BigInt(x.blockNumber) < BigInt(y.blockNumber)) return -1;
    return Number(x.logIndex) - Number(y.logIndex);
  });
}

export async function setLogsByMillion(
  gk:Hex, title:string, address:Hex, 
  name:string, million:string, data:ArbiscanLog[],
): Promise<boolean> {

  const docRef = doc(db, gk.toLowerCase(), 'logInfo', title, address.toLowerCase(), name, million);

  try {
    let prevData = await getLogsByMillion(gk, title, address, name, million);
    if (prevData && prevData.length > 0) 
        data = mergeAndSort(prevData, data);

    await setDoc(docRef, {records: data});    
    return true;
  } catch (error: any) {
    console.error("Error set Logs by million: ", error);
    return false;
  }

}

export async function setLogs(
  gk:Hex, title:string, address: Hex, name:string, data:ArbiscanLog[]
): Promise<boolean> {

  if (!data || data.length === 0) {
    console.log("No logs data to process.");
    return false;
  }

  const groupedByMillion:{[key:string]:ArbiscanLog[]} = {};

  data.forEach(v => {
    const key = (BigInt(v.blockNumber) / 10n ** 6n).toString();

    if (!groupedByMillion[key]) {
      groupedByMillion[key] = [];
    }

    groupedByMillion[key].push(v);
  });

  console.log('ArbiscanLogs grouped by Million: ', groupedByMillion);

  const promises: Promise<boolean>[] = [];

  for (const key in groupedByMillion) {
    if (Object.hasOwnProperty.call(groupedByMillion, key)) {
      const dataForMonth = groupedByMillion[key];
      promises.push(setLogsByMillion(gk, title, address, name, key, dataForMonth));
    }
  }

  const results = await Promise.all(promises);

  return results.every(result => result === true);
}

// ==== Auto Update ====

export async function autoUpdateLogs(chainId:number, gk:Hex, toBlk:bigint):Promise<boolean> {

    let menu = await getMenuOfLogs(gk);

    if (!menu) return false;

    let len = menu.length;

    while (len > 0) {
        let info = menu[len-1];

        let fromBlk = await getTopBlkOf(gk, info.address);

        if (fromBlk == 1n || fromBlk >= toBlk) return false;
        else fromBlk++;

        let data = await fetchArbiscanData(chainId, info.address, fromBlk, toBlk);
        
        if (data) {
            let logs = data.result;
            // console.log('get logs:', logs);

            if (logs.length > 0) {
                let width = info.name.length;

                while(width > 0) {
                    let name = info.name[width - 1];
                    let topic0 = keccak256(toHex(info.abiStr[width - 1]));
                    
                    let events = logs.filter((v) => {
                        return v.topics[0]?.toLowerCase() == topic0.toLowerCase();
                    });

                    if (events.length > 0) {
                        let flag = await setLogs(gk, info.title, info.address, name, events);   
                        if (flag) console.log('appended', events.length, ' events of ', name);
                        else return false;
                    }

                    width--;
                }
            }

           let flag = await setTopBlkOf(gk, info.address, toBlk);
           if (!flag) return false;
            
        }

        await delay(500);

        len--;
    }

    return true;
}

// ==== Decode Arbiscan Log ====

export function decodeArbiscanLog(log:ArbiscanLog, abiStr:string) {
    const eventAbi = parseAbiItem(abiStr);

    const {eventName, args} = decodeEventLog({
    abi: [eventAbi],
    data: log.data,
    topics: log.topics,
    });

    return {...log, eventName, args};
}


