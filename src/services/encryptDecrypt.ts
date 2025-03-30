// src/services/encryptDecrypt.ts
import * as openpgp from 'openpgp';
import * as fs from 'fs';
import { injectable } from 'inversify';
import { IEncryptDecrypt } from '../interfaces/encryptDecrypt.interface';

@injectable()
export class SimpleEncryptDecrypt implements IEncryptDecrypt {
    async encrypt(data: Buffer, publicKeyArmored: string, outputPath: string): Promise<void> {
        const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
        const message = await openpgp.createMessage({ binary: data });
        const encrypted = await openpgp.encrypt({
            message,
            encryptionKeys: publicKey,
        });
        fs.writeFileSync(outputPath, encrypted, 'utf-8');
        console.log(`File encrypted and saved as: ${outputPath}`);
    }

    async decrypt(encryptedData: Buffer, privateKeyArmored: string, passphrase: string, outputPath: string): Promise<void> {
        const privateKey = await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
            passphrase,
        });
        const message = await openpgp.readMessage({ armoredMessage: encryptedData.toString() });
        const { data } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKey,
        });
        fs.writeFileSync(outputPath, data as Uint8Array);
        console.log(`File decrypted and saved as: ${outputPath}`);
    }
}
