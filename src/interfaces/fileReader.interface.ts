export interface IFileReader {
    readFile(filePath: string): Buffer;
    writeFile(filePath: string, data: Buffer): void;
}