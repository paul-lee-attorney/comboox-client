import dayjs from "dayjs";
import { utils } from "ethers";
import { HexType } from "../interfaces";

export function toPercent(num: number): string {
  let percent = num == 0 ? '-' : Number(num / 100).toFixed(2) + '%';
  return percent;
}

export function toBasePoint(percent: string): number {
  let strPercent = percent.replace('%', '').replace('.', '');
  let basePoint = parseInt(strPercent);
  return basePoint;
}

export function dateParser(timestamp: number): string {
  return timestamp == 0 ? '-' : dayjs.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
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

export function selectorCodifier(func: string): HexType {
  let hash = utils.keccak256(utils.toUtf8Bytes(func));
  return `0x${hash.substring(2,10)}`;
}

export function splitStrArr(input: string[]):string{
  let out:string = '';
  input.forEach(v => {
    out += v + '\n';
  });
  return out;
}

export function splitPayload(input: string):string[]{
  let out:string[] = [];
  let len = parseInt(`${input.length/64}`);
  let i = 0;
  while (i < len) {
    out.push(input.substring(i*64, (i+1)*64));
    i++;
  }
  return out;
}

export function HexParser(input: string):HexType {
  
  let prefix = input.substring(0,2);

  let output: HexType;

  if (prefix == '0x') output = `0x${input.substring(2)}`;
  else output = `0x${input}`;

  return output;
}

export function toStr(input: number): string {

  let hex = input.toString(16);
  if (hex.length % 2 != 0) hex = '0' + hex;
  let len = hex.length;
  let i=0;
  let str = '';

  while (i <= len) {
    let charHex = `0x${hex.substring(0, 2)}`;
    str += String.fromCharCode(Number(charHex));
    hex = hex.substring(2);
    i += 2;
  }

  return str;
}

export function toAscii(input: string): string {
  let str = '';
  
  input.split('').forEach(
    v => str += v.charCodeAt(0).toString(16).padStart(2,'0')
  );

  return str;
}

