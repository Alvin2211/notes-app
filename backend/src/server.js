import 'dotenv/config'; // immediately loads .env into process.env
import { app } from './app.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on('error', (error) => {
      console.error('ERROR OCCURRED:', error);
    });

    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('ERROR OCCURRED:', error);
    process.exit(1);
  });
