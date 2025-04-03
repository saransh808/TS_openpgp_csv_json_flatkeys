// src/services/fileReader.ts
import * as fs from 'fs';
import { injectable } from 'inversify';
import { IFileReader } from '../interfaces/fileReader.interface';

@injectable()
export class FileSystemReader implements IFileReader {
    readFile(filePath: string): Buffer {
        return fs.readFileSync(filePath);
        //this is a test comment for git fetch and git merge
    }

    writeFile(filePath: string, data: Buffer): void {
        fs.writeFileSync(filePath, data);
    }
}
