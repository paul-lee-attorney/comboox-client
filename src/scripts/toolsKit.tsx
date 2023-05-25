import { BigNumber } from "ethers";

export function toPercent(num: number): string {
  let percent = Number(num / 100).toFixed(2) + '%';
  return percent;
}

export function toBasePoint(percent: string): number {
  let strPercent = percent.replace('%', '').replace('.', '');

  let basePoint = parseInt(strPercent);

  return basePoint;
}

export function dateParser(timestamp: number): string {

  if (timestamp === 0) return '0';

  let numDate = timestamp * 1000;
  let date1 = new Date(numDate);
  let date2 = date1.toLocaleDateString().replace(/\//g, "-") + ' ' + date1.toTimeString().substring(0,8);

  return date2;
}

export function userNoParser(data: BigNumber): string {
  return data.toHexString().substring(2).padStart(10, '0');
}


