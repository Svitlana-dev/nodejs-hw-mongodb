import dotenv from 'dotenv';
dotenv.config();

import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

async function main() {
  await initMongoConnection();

  const app = setupServer();

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('Startup error:', err.message);
  process.exit(1);
});
