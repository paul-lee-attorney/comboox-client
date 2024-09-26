import Error from "next/error";
import { ErrorInfo } from "react";

const fs = require("fs");
const path = require("path");

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

type PricePoint = [
    timestamp: number,
    price: number,
];

// Function to find the closest price for a given timestamp using binary search
// The closest timestamp must be less than or equal to the target timestamp
function findClosestPrice(data:PricePoint[], targetTimestamp:number) {
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

// Function to load the data from the appropriate JSON file based on the target timestamp
function loadData(targetTimestamp:number) {
    const yearMonth = getYearMonthFromTimestamp(targetTimestamp);
    const filePath = path.join(__dirname, `eth_price_${yearMonth}.json`);

    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return `File not found: ${filePath}`;        
    }

    const rawData = fs.readFileSync(filePath);
    const jsonData = JSON.parse(rawData);

    return jsonData.prices; // Assuming the data structure has 'prices' array
}

// Main function to get the applicable price at a specific timestamp
export function getPriceAtTimestamp(targetTimestamp:number): number | null {
    console.log('target: ', targetTimestamp);
    try {
        const data = loadData(targetTimestamp);
        const ethPrice = findClosestPrice(data, targetTimestamp);

        if (ethPrice === null) {
            console.log(`No applicable price found for timestamp ${targetTimestamp}`);
        } else {
            console.log(`The closest Ethereum price at timestamp ${targetTimestamp} is $${ethPrice}`);
        }

        return ethPrice;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

// Example usage
const targetTimestamp = 1715505980000; // Example timestamp in milliseconds (UTC)
getPriceAtTimestamp(targetTimestamp);
