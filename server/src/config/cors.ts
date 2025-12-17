import { CorsOptions } from 'cors';
import { env } from './env';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // If CORS_ORIGIN is '*', allow all origins
    if (env.CORS_ORIGIN === '*') {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};



