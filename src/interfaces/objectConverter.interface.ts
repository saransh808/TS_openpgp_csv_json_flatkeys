export interface IObjectConverter {
    convertCSVToJSON(csvContent: string): object[];
}