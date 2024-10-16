import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { HexType } from '../../app/common';
import { CashflowProps } from '../../app/comp/components/FinStatement';
import { HexParser } from '../../app/common/toolsKit';
import { getMonthRanges } from './ethPriceTools';


export type CashflowStrProps = {
  seq: string,
  blockNumber: string,
  timestamp: string,
  transactionHash: string,
  typeOfIncome: string,
  amt: string,
  usd: string,
  ethPrice: string,
  addr: string,
  acct: string,
}

export function cashflowDataToString(input:CashflowProps[]): CashflowStrProps[] {
  let output = input.map(v=>({
    seq: v.seq.toString(),
    blockNumber: v.blockNumber.toString(),
    timestamp: v.timestamp.toString(),
    transactionHash: v.transactionHash.toLowerCase(),
    typeOfIncome: v.typeOfIncome,
    amt: v.amt.toString(),
    usd: v.usd.toString(),
    ethPrice: v.ethPrice.toString(),
    addr: v.addr.toLowerCase(),
    acct: v.acct.toString()
  }));

  return output;
}

export function cashflowStringToData(input:CashflowStrProps[]): CashflowProps[] {
  let output = input.map(v=>({
    seq: Number(v.seq),
    blockNumber: BigInt(v.blockNumber),
    timestamp: BigInt(v.timestamp),
    transactionHash: HexParser(v.transactionHash),
    typeOfIncome: v.typeOfIncome,
    amt: BigInt(v.amt),
    usd: BigInt(v.usd),
    ethPrice: BigInt(v.ethPrice),
    addr: HexParser(v.addr),
    acct: BigInt(v.acct)
  }));

  return output;
}

export async function getFinDataByMonth(gk: HexType, typeOfInfo:string, month:string): Promise<CashflowProps[] | undefined> {

  // 获取特定文档
  const docRef = doc(db, gk.toLowerCase(), 'finInfo', typeOfInfo, month);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let res = docSnap.data()?.records as CashflowStrProps[];
    return cashflowStringToData(res);
  } else {
    console.log("no financial data found!");
    return undefined;
  }
}

export async function getFinData(gk: HexType, typeOfInfo: string): Promise<CashflowProps[] | undefined> {
  let output: CashflowProps[] = [];

  try {
    const monthCollRef = collection(db, gk.toLowerCase(), 'finInfo', typeOfInfo);
    const monthDocsSnap = await getDocs(monthCollRef);

    if (monthDocsSnap.empty) {
      console.log('No month data exists');
      return undefined;
    }

    const months = monthDocsSnap.docs.map(coll => coll.id).sort();

    // Use `for...of` to ensure proper async handling in loops
    for (const month of months) {
      const queryData = await getFinDataByMonth(gk, typeOfInfo, month);

      if (queryData && queryData.length > 0) {
        output = output.concat(queryData);
      }
    }

    return output.length > 0 ? output : undefined;

  } catch (error) {
    console.error("Error fetching financial data: ", error);
    return undefined;
  }
}

export async function setFinDataByMonth(gk: HexType, typeOfInfo:string, month:string, data:CashflowProps[]): Promise<boolean> {

  // 创建一个文档引用
  const docRef = doc(db, gk.toLowerCase(), 'finInfo', typeOfInfo, month);

  try {

    let prevData = await getFinDataByMonth(gk, typeOfInfo, month);

    if (prevData && prevData.length > 0) {
      if (prevData[prevData.length - 1].timestamp < data[0].timestamp) {
          data = prevData.concat(data);
      } else {
          return true;
      }
    }

    await setDoc(docRef, {records: cashflowDataToString(data)});
    console.log('successfully setDoc');
    
    return true;
  } catch (error: any) {
    console.error("Error fetching financial data: ", error);
    return false;
  }

}


export async function setFinData(gk: HexType, typeOfInfo:string, data:CashflowProps[]): Promise<boolean> {

  if (!data || data.length === 0) {
    console.log("No cashflow data to process.");
    return false;
  }

  // Group the data by year and month
  const groupedByMonth:{[key:string]:CashflowProps[]} = {};

  data.forEach(v => {
    const date = new Date(Number(v.timestamp) * 1000);  // Convert the timestamp to Date
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Months are 0-based in JS

    const key = `${year}-${month}`;  // e.g., '2023-09'

    if (!groupedByMonth[key]) {
      groupedByMonth[key] = [];
    }

    groupedByMonth[key].push(v);
  });

  console.log('groupedByMonth: ', groupedByMonth);

  // Array to store all Firestore write operations
  const promises: Promise<boolean>[] = [];

  // Store each grouped array in Firestore
  for (const key in groupedByMonth) {
    if (Object.hasOwnProperty.call(groupedByMonth, key)) {

      const dataForMonth = groupedByMonth[key];
      console.log('key', key);
      console.log('dataForMonth: ', dataForMonth);

      promises.push(setFinDataByMonth(gk, typeOfInfo, key, dataForMonth));

    }
  }

  // Wait for all the setFinDataByMonth calls to complete
  const results = await Promise.all(promises);

  // Check if all operations were successful
  return results.every(result => result === true);
}
