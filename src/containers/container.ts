// src/container.ts
import { Container } from 'inversify';

import { IFileReader } from '../interfaces/fileReader.interface';
import { ICSVGenerator } from '../interfaces/csvGenerator.interface';
import { IEncryptDecrypt } from '../interfaces/encryptDecrypt.interface';
import { IObjectConverter } from '../interfaces/objectConverter.interface';

import { FileSystemReader } from '../services/fileReader';
import { SimpleCSVGenerator } from '../services/csvGenerator';
import { SimpleEncryptDecrypt } from '../services/encryptDecrypt';
import { SimpleObjectConverter } from '../services/objectConverter';
import { Main  } from '../main'; // Import Main class

const container = new Container();

// Bind the classes/interfaces to the container
container.bind<IFileReader>('FileReader').to(FileSystemReader);
container.bind<ICSVGenerator>('CSVGenerator').to(SimpleCSVGenerator);
container.bind<IEncryptDecrypt>('EncryptDecrypt').to(SimpleEncryptDecrypt);
container.bind<IObjectConverter>('ObjectConverter').to(SimpleObjectConverter);


container.bind<Main>(Main).toSelf(); // Ensure that the Main class is bound


export { container };