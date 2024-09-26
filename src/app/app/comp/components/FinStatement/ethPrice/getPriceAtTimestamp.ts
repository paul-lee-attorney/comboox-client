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

// Helper function to convert a timestamp to "YYYY-MM" format
function getYearMonthFromTimestamp(timestamp:number) {
    const date = new Date(timestamp);
    console.log('date: ', date);
    const year = date.getUTCFullYear();
    console.log('year: ', year);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    console.log('month: ', month);
    return `${year}-${month}`;
}

// Function to find the closest price for a given timestamp using binary search
// The closest timestamp must be less than or equal to the target timestamp
function findClosestPrice(data:number[][], targetTimestamp:number) {
    let left = 0;
    let right = data.length - 1;
    let closestPrice = null;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midTimestamp = data[mid][0];

        if (midTimestamp === targetTimestamp) {
            return data[mid][1]; // Exact match
        }

        if (midTimestamp < targetTimestamp) {
            closestPrice = data[mid][1]; // Update closest price for earlier timestamp
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // If we exit the loop, closestPrice contains the most recent earlier or equal timestamp's price
    return closestPrice;
}

// Main function to get the applicable price at a specific timestamp
// Takes an object that contains multiple month JSON data as input
function getPriceAtTimestamp(targetTimestamp: number, dataObj: { [key: string]: number[][] }): number | null {
    const yearMonth = getYearMonthFromTimestamp(targetTimestamp);

    // Check if the data for the required month exists
    const data = dataObj[yearMonth];
    if (!data) {
        console.error(`No data available for the month: ${yearMonth}`);
        return null;
    }

    // Find the closest price in the given month's data
    const ethPrice = findClosestPrice(data, targetTimestamp);

    if (ethPrice === null) {
        console.log(`No applicable price found for timestamp ${targetTimestamp}`);
    } else {
        console.log(`The closest Ethereum price at timestamp ${targetTimestamp} is $${ethPrice}`);
    }

    return ethPrice;
}

export function getEthPriceAtTimestamp(targetTimestamp: number): number | null {
    return getPriceAtTimestamp(targetTimestamp, ethPriceData);
}
