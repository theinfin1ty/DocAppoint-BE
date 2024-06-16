import { config } from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as admin from 'firebase-admin';
import morgan from 'morgan';
import routes from './routes/index';
import CONFIG from './config/config';

config();

const app = express();

admin.initializeApp({
  credential: admin.credential.cert({
    type: CONFIG.FIREBASE_ACCOUNT_TYPE,
    project_id: CONFIG.FIREBASE_PROJECT_ID,
    private_key_id: CONFIG.FIREBASE_PRIVATE_KEY_ID,
    private_key: CONFIG.FIREBASE_PRIVATE_KEY,
    client_email: CONFIG.FIREBASE_CLIENT_EMAIL,
    client_id: CONFIG.FIREBASE_CLIENT_ID,
    auth_uri: CONFIG.FIREBASE_AUTH_URI,
    token_uri: CONFIG.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: CONFIG.FIREBASE_AUTH_PROVIDER_x509_CERT_URL,
    client_x509_cert_url: CONFIG.FIREBASE_CLIENT_x509_CERT_URL,
  } as admin.ServiceAccount),
});

mongoose
  .connect(process.env.DB_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api', routes);

app.all('*', (req, res) => {
  res.send('404 Not Found');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).send({ error: err.message });
});

app.listen(process.env.PORT, () => {
  console.log(`Serving on port ${process.env.PORT}`);
});
