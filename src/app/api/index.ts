import { AddrZero, HexType } from "../app/common";
import { verifyMessage } from "ethers";
import * as crypto from "crypto";
import { keccak256 } from "viem";

export interface UserInfo {
  address: HexType,
  gk: HexType,
  firstName: string,
  lastName: string,
  email: string,
  documentType: string,
  issueCountry: string,
  issueState: string,
  dateOfBirth: string,
  dateOfExpiry: string,
  documentNumber: string,
  sig: string,
}

export const defaultUserInfo: UserInfo = {
  address: AddrZero,
  gk: AddrZero,
  firstName: '',
  lastName: '',
  email: '',
  documentType: '',
  issueCountry: '',
  issueState: '',
  dateOfBirth: '',
  dateOfExpiry: '',
  documentNumber: '',
  sig: ''
}

export const idDocTypes = [
  'ID Card', 'Passport', 'Driver License', 'Travle Document', 'Others'
]

export const countries = [
  'Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria', 
  'Canada', 'China', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany',
  'Greece', 'Hungary', 'India', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Latvia', 'Lithuania', 'Luxembourg',
  'Malta', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
  'Poland', 'Portugal', 'Romania', 'Russia', 'Singapore',
  'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
  'Spain', 'Sweden', 'Switzerland', 'United Kingdom', 'United States',
  'Others'
]

export const statesOfUS = [
  'AL - Alabama', 'AK - Alaska', 'AZ - Arizona', 'AR - Arkansas', 'CA - California', 
  'CO - Colorado', 'CT - Connecticut', 'DE - Delaware', 'FL - Florida', 'GA - Georgia', 
  'HI - Hawaii', 'ID - Idaho', 'IL - Illinois', 'IN - Indiana', 'IA - Iowa', 
  'KS - Kansas', 'KY - Kentucky', 'LA - Louisiana', 'ME - Maine', 'MD - Maryland', 
  'MA - Massachusetts', 'MI - Michigan', 'MN - Minnesota', 'MS - Mississippi', 'MO - Missouri', 
  'MT - Montana', 'NE - Nebraska', 'NV - Nevada', 'NH - New Hampshire', 'NJ - New Jersey', 
  'NM - New Mexico', 'NY - New York', 'NC - North Carolina', 'ND - North Dakota', 'OH - Ohio', 
  'OK - Oklahoma', 'OR - Oregon','PA - Pennsylvania', 'RI - Rhode Island', 'SC - South Carolina',
  'SD - South Dakota', 'TN - Tennessee', 'TX - Texas','UT - Utah', 'VT - Vermont',
  'VA - Virginia', 'WA - Washington', 'WV - West Virginia', 'WI - Wisconsin', 'WY - Wyoming',
]

export interface SigInfo {
  address: HexType;
  message: string;
  sig: string;
}

export function verifySig(info: SigInfo): boolean {

  if (!info.sig || info.address == AddrZero) return false;

  let recoveredAddr = verifyMessage(info.message, info.sig);

  if (recoveredAddr == info.address) {    
    return true;
  } else {
    return false;
  }

}

export type KeyIV = {
  key: string;
  iv: string;
}

export function prepareKeyIV(addr: HexType, gk: HexType): KeyIV {
  
  let res:KeyIV = {
      key : keccak256(Buffer.from(addr + process.env.NEXT_PUBLIC_SALT)).substring(2,18),
      iv: keccak256(Buffer.from(gk + process.env.NEXT_PUBLIC_SALT)).substring(2,18),
  }

  return res;
}

export function encrypt(message:string, key:string, iv:string):string {

  const algorithm = 'aes-128-cbc';

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

export function decrypt(encrypted:string, key:string, iv:string):string {

  const algorithm = 'aes-128-cbc';

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptUserInfo(info: UserInfo): UserInfo {

  const kv:KeyIV = prepareKeyIV(info.address, info.gk);

  // const key = info.address.substring(2,18);
  // const iv = info.gk.substring(2, 18);
  
  // info.address = `0x${encrypt(info.address, kv.key, kv.iv)}`;
  
  info.firstName = encrypt(info.firstName, kv.key, kv.iv);
  info.lastName = encrypt(info.lastName, kv.key, kv.iv);

  info.email = encrypt(info.email, kv.key, kv.iv);  
  info.documentType = encrypt(info.documentType, kv.key, kv.iv);
  info.issueCountry = encrypt(info.issueCountry, kv.key, kv.iv);
  info.issueState = encrypt(info.issueState, kv.key, kv.iv);
  info.dateOfBirth = encrypt(info.dateOfBirth, kv.key, kv.iv);
  info.dateOfExpiry = encrypt(info.dateOfExpiry, kv.key, kv.iv);
  info.documentNumber = encrypt(info.documentNumber, kv.key, kv.iv);

  return info;
}

export function decryptUserInfo(info: UserInfo): UserInfo {

  const kv:KeyIV = prepareKeyIV(info.address, info.gk);
  
  // const key = info.address.substring(2,18);
  // const iv = info.gk.substring(2, 18);
  
  info.firstName = decrypt(info.firstName, kv.key, kv.iv);
  info.lastName = decrypt(info.lastName, kv.key, kv.iv);

  info.email = decrypt(info.email, kv.key, kv.iv);  
  info.documentType = decrypt(info.documentType, kv.key, kv.iv);
  info.issueCountry = decrypt(info.issueCountry, kv.key, kv.iv);
  info.issueState = decrypt(info.issueState, kv.key, kv.iv);
  info.dateOfBirth = decrypt(info.dateOfBirth, kv.key, kv.iv);
  info.dateOfExpiry = decrypt(info.dateOfExpiry, kv.key, kv.iv);
  info.documentNumber = decrypt(info.documentNumber, kv.key, kv.iv);

  return info;
}



