import dayjs from "dayjs";
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
  return dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

export function longSnParser(sn: string): string {
  if (sn.length < 4) sn = sn.padStart(4, '0');
  sn = sn.replace(/\d{1,4}(?=(\d{4})+$)/g, (match) => (match + '-'));
  if (sn === '0000') sn = '-';
  return sn;
}

export function longDataParser(data: string): string {
  return new Intl.NumberFormat().format(data);
}