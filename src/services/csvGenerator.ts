// src/services/csvGenerator.ts
import * as fs from 'fs';
import * as path from 'path';
import { injectable } from 'inversify';
import { ICSVGenerator } from '../interfaces/csvGenerator.interface';

@injectable()
export class SimpleCSVGenerator implements ICSVGenerator {
    generateRandomCSV(filePath: string, fileName: string, rows: number): string {
        const csvHeader = ['Name,Age,City']; // CSV header
        for (let i = 0; i < rows; i++) {
            const name = `Name${i + 1}`;
            const age = Math.floor(Math.random() * 100);
            const city = `City${Math.floor(Math.random() * 10)}`;
            csvHeader.push(`${name},${age},${city}`);
        }
        // const pgpKeysDir = path.join(__dirname, 'pgp_keys');
        filePath = path.join(filePath, fileName);
        const csvData = csvHeader.join('\n');
        console.log(csvData);
        const buffer = new TextEncoder().encode(csvData);
        console.log(buffer);
        fs.writeFileSync(filePath, buffer, 'utf-8');
        console.log(`CSV file generated at: ${filePath}`);
        return filePath;
    }
}
