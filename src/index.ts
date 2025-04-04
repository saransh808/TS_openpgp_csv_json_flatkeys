// src/index.ts
import { container } from './containers/container';
import { Main } from './main';

// Get the Main instance from the container and execute the run method
const mainApp = container.get<Main>(Main);
mainApp.run();



