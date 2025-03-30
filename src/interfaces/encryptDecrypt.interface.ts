export interface IEncryptDecrypt {
    encrypt(data: Buffer, publicKeyArmored: string, outputPath: string): void;
    decrypt(encryptedData: Buffer, privateKeyArmored: string, passphrase: string, outputPath: string): void;
}