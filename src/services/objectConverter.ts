// src/services/objectConverter.ts
import { injectable } from 'inversify';
import { IObjectConverter } from '../interfaces/objectConverter.interface';

@injectable()
export class SimpleObjectConverter implements IObjectConverter {
    convertCSVToJSON(csvContent: string): object[] {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        const jsonObjects = lines.slice(1).map(line => {
            const values = line.split(',');
            const jsonObject: { [key: string]: any } = {};
            headers.forEach((header, index) => {
                jsonObject[header] = values[index];
            });
            return jsonObject;
        });

        return jsonObjects;
    }
}
