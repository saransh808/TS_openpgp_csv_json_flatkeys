export interface ICSVGenerator {
    generateRandomCSV(filPath:string, fileName: string, rows: number): string;
}