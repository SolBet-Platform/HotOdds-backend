// import cron from "node-cron"
import fs from 'fs/promises';
import path from 'path';
import { SportApiService } from 'controller/sport';

const sportApiService = new SportApiService();

// make requests from the application

// store response data into json file


const arr = [
    {
        reqFunc: sportApiService.getFixtures, 
        filename: "fixtures"
    }
]

async function saveToFile(data: unknown, filename: string):Promise<void> {
    const filePath = path.join('../static', filename);
    await fs.mkdir('data', { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filePath}`);
}

export async function reqCaller(): Promise<void>{
    await Promise.all(arr.map(async (endpoint)=>{
        const data = endpoint.reqFunc()
        await saveToFile(data, endpoint.filename)
    }))
}
