import { AddrZero, HexType } from "../app/common";
import { verifyMessage } from "ethers";
import * as crypto from "crypto";

export interface UserInfo {
  address: HexType,
  gk: HexType,
  name: string,
  email: string,
  documentType: string,
  issueCountry: string,
  dateOfBirth: string,
  dateOfExpiry: string,
  documentNumber: string,
  sig: string,
}

export const defaultUserInfo: UserInfo = {
  address: AddrZero,
  gk: AddrZero,
  name: '',
  email: '',
  documentType: '',
  issueCountry: '',
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

  const key = info.address.substring(2,18);
  const iv = info.gk.substring(2, 18);
  
  info.address = `0x${encrypt(info.address, key, iv)}`;
  
  info.name = encrypt(info.name, key, iv);
  info.email = encrypt(info.email, key, iv);  
  info.documentType = encrypt(info.documentType, key, iv);
  info.issueCountry = encrypt(info.issueCountry, key, iv);
  info.dateOfBirth = encrypt(info.dateOfBirth, key, iv);
  info.dateOfExpiry = encrypt(info.dateOfExpiry, key, iv);
  info.documentNumber = encrypt(info.documentNumber, key, iv);

  return info;
}

export function decryptUserInfo(info: UserInfo): UserInfo {

  const key = info.address.substring(2,18);
  const iv = info.gk.substring(2, 18);
  
  info.name = decrypt(info.name, key, iv);
  info.email = decrypt(info.email, key, iv);  
  info.documentType = decrypt(info.documentType, key, iv);
  info.issueCountry = decrypt(info.issueCountry, key, iv);
  info.dateOfBirth = decrypt(info.dateOfBirth, key, iv);
  info.dateOfExpiry = decrypt(info.dateOfExpiry, key, iv);
  info.documentNumber = decrypt(info.documentNumber, key, iv);

  return info;
}



