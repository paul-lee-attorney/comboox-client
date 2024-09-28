import { numberToBytes } from 'viem';
import ethPriceNov2023 from './eth_price_2023-11.json';
import ethPriceDec2023 from './eth_price_2023-12.json';
import ethPriceJan2024 from './eth_price_2024-01.json';
import ethPriceFeb2024 from './eth_price_2024-02.json';
import ethPriceMar2024 from './eth_price_2024-03.json';
import ethPriceApr2024 from './eth_price_2024-04.json';
import ethPriceMay2024 from './eth_price_2024-05.json';
import ethPriceJun2024 from './eth_price_2024-06.json';
import ethPriceJul2024 from './eth_price_2024-07.json';
import ethPriceAug2024 from './eth_price_2024-08.json';
import ethPriceSep2024 from './eth_price_2024-09.json';

const ethPriceData = {
    '2023-11': ethPriceNov2023.prices,
    '2023-12': ethPriceDec2023.prices,
    '2024-01': ethPriceJan2024.prices,
    '2024-02': ethPriceFeb2024.prices,
    '2024-03': ethPriceMar2024.prices,
    '2024-04': ethPriceApr2024.prices,
    '2024-05': ethPriceMay2024.prices,
    '2024-06': ethPriceJun2024.prices,
    '2024-07': ethPriceJul2024.prices,
    '2024-08': ethPriceAug2024.prices,
    '2024-09': ethPriceSep2024.prices,
}

export type EthPrice ={
    timestamp: number;
    price: number;
}

export const defaultEthPrice:EthPrice = {
    timestamp: 0,
    price: 0,
}

function getYearMonthFromTimestamp(timestamp:number) {
    const date = new Date(timestamp);
    // console.log('date: ', date);
    const year = date.getUTCFullYear();
    // console.log('year: ', year);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    // console.log('month: ', month);
    return `${year}-${month}`;
}

function findClosestPrice(data:number[][], targetTimestamp:number) {
    let left = 0;
    let right = data.length - 1;
    let mark:EthPrice = {
        timestamp: 0,
        price: 0,
    };

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTimestamp = data[mid][0];

        if (midTimestamp === targetTimestamp) {
            mark.timestamp = midTimestamp;
            mark.price = data[mid][1];
            break;
        }

        if (midTimestamp < targetTimestamp) {
            mark.timestamp = midTimestamp;
            mark.price = data[mid][1]; // Update closest price for earlier timestamp
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return mark;
}

export type CentPrice = {
    timestamp: number;
    centPrice: bigint;
}

export const defaultCentPrice = {
    timestamp: 0,
    centPrice: 0n,
}

function getPriceAtTimestamp(targetTimestamp: number, dataObj: { [key: string]: number[][] }): CentPrice {
    const yearMonth = getYearMonthFromTimestamp(targetTimestamp);

    let mark:EthPrice = defaultEthPrice;
    let output:CentPrice = defaultCentPrice;

    const data = dataObj[yearMonth];
    if (!data) {
        console.error(`No data available for the month: ${yearMonth}`);
        return output;
    }

    mark = findClosestPrice(data, targetTimestamp);

    if ( mark.price === null) {
        console.log(`No applicable price found for timestamp ${targetTimestamp}`);
        return output;
    } else {
        console.log(`The Ethereum price at timestamp ${targetTimestamp} is $${mark.price}`);
    }

    output.timestamp = mark.timestamp;
    output.centPrice = 10n ** 34n / BigInt(mark.price * 10 ** 18);

    return output;
}

export function getCentPriceInWeiAtTimestamp(targetTimestamp: number): CentPrice {
    return getPriceAtTimestamp(targetTimestamp, ethPriceData);
}
