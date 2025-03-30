// src/main.ts
import 'reflect-metadata';  // Required for Inversify decorators
import * as path from 'path';
import * as fs from 'fs';


import { inject, injectable } from 'inversify';
import { container } from './containers/container';
import { IFileReader } from './interfaces/fileReader.interface';
import { ICSVGenerator } from './interfaces/csvGenerator.interface';
import { IEncryptDecrypt } from './interfaces/encryptDecrypt.interface';
import { IObjectConverter } from './interfaces/objectConverter.interface';

@injectable()
class Main {
    // Inject dependencies via constructor
    constructor(
        @inject('FileReader') private readonly fileReader: IFileReader,
        @inject('CSVGenerator') private readonly csvGenerator: ICSVGenerator,
        @inject('EncryptDecrypt') private readonly encryptDecrypt: IEncryptDecrypt,
        @inject('ObjectConverter') private readonly objectConverter: IObjectConverter
    ) { }

    async run() {
        console.log("HELLO")
        const filePath = `${__dirname}/OUTPUT/file4`;
        // File paths and keys
        const pgpKeysDir = path.join(__dirname, 'pgp_keys/flat_keys');
        if (!fs.existsSync(pgpKeysDir)) {
            fs.mkdirSync(pgpKeysDir, { recursive: true });  // Create directory if it doesn't exist
            console.log('Created pgp_keys directory');
        }
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });  // Create directory if it doesn't exist
            console.log('Created pgp_keys directory');
        }

        // const publicKeyPath = path.join(pgpKeysDir, 'publicKey.txt');
        const publicKeyPath = path.join(pgpKeysDir, 'publicKeyFlat.txt');
        // const privateKeyPath = path.join(pgpKeysDir, 'privateKey.txt');
        const privateKeyPath = path.join(pgpKeysDir, 'privateKeyFlat.txt');
        const passphrase = 'your-secure-passphrase';
        const publicKeyArmored = fs.readFileSync(publicKeyPath, 'utf-8');
        const privateKeyArmored = fs.readFileSync(privateKeyPath, 'utf-8');

        // Step 1: Generate a random CSV file
        const csvFileName = 'random_data.csv';
        this.csvGenerator.generateRandomCSV(filePath, csvFileName, 10);

        // Step 2: Encrypt the generated CSV file
        const encryptedFileName = 'random_data.csv.pgp';
        const csvSourceFilePath = path.join(filePath, csvFileName);
        const fileDataBuffer = this.fileReader.readFile(csvSourceFilePath);
        console.log(typeof fileDataBuffer);
        const encryptedFilePath = path.join(filePath, encryptedFileName);
        let publicKeyPair = splitKeyAndPassPhrase(publicKeyArmored);
        console.log(fileDataBuffer);
        console.log(fileDataBuffer.toString());
        await this.encryptDecrypt.encrypt(fileDataBuffer, publicKeyPair.Key, encryptedFilePath);

        // Step 3: Decrypt the encrypted file
        const fileEncryptedDataBuffer = this.fileReader.readFile(encryptedFilePath);
        // console.log(typeof fileEncryptedDataBuffer);
        const decryptedFileName = 'decrypted_data.csv';
        const decryptedFilePath = path.join(filePath, decryptedFileName);
        let privateKeyPair = splitKeyAndPassPhrase(privateKeyArmored);
        // console.log(Key, Secret);
        await this.encryptDecrypt.decrypt(Buffer.from(fileEncryptedDataBuffer), privateKeyPair.Key, privateKeyPair.Secret, decryptedFilePath);
        // await this.encryptDecrypt.decrypt(Buffer.from(fileEncryptedDataBuffer), privateKeyArmored, passphrase, decryptedFilePath);


        // // // // Step 4: Read decrypted CSV file and convert it to JSON
        const decryptedCSVContent = this.fileReader.readFile(decryptedFilePath).toString();
        const jsonData = this.objectConverter.convertCSVToJSON(decryptedCSVContent);
        console.log('Converted JSON:', jsonData);
    }
}



function splitKeyAndPassPhrase(privateKeyWithPassPhraseArmored: string): { Key: string, Secret: string } {
    let Key: string = "";
    let Secret: string = "";
    let pairs = privateKeyWithPassPhraseArmored.split(",");
    const result: { [key: string]: string } = {};
    pairs.map(pair => {
        const [key, value] = pair.split(/:(.+)/);
        if (key && value) {
            result[key.trim()] = value.trim();
        }
    })
    Key = result['Key'];
    // console.log("Key before \\n", Key);

    Key = Key.replace(/\\n/g, '\n');

    Key = Key.replace(/\\t/g, '\n');
    // console.log("Key afetr n", Key);
    Secret = result['Secret'];
    return { Key: Key, Secret: Secret };
}

// Instantiate the main class and run the process
export { Main };
