import {errorHandler, notFoundHandler} from './middlewares/error-handler.mjs';
import kubiosRouter from './routes/kubios-router.mjs';
import surveyRouter from './routes/survey-router.mjs';
import entryRouter from './routes/entry-router.mjs';
import userRouter from './routes/user-router.mjs';
import authRouter from './routes/auth-router.mjs';
import logger from './middlewares/logger.mjs';
import {fileURLToPath} from 'url';
import express from 'express';
import cors from 'cors';
import path from 'path';

// Define the host
const hostname = '127.0.0.1';
const port = 3000;
// Create express instance
const app = express();
// Middleware for enabling CORS
app.use(cors());
// Middleware for logging HTTP requests
app.use(logger);
// Middleware for parsing JSON bodies of incoming requests
app.use(express.json());
// Staattinen sivusto palvelimen juureen
app.use(express.static('public'));
// Serve static files from the 'docs' directory at the '/docs' URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/docs', express.static(path.join(__dirname, '../docs')));
// Direct requests to correct routers
app.use('/api/users', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/auth', authRouter);
app.use('/api/kubios', kubiosRouter);
app.use('/api/survey', surveyRouter);
// Middleware for handling 404 errors
app.use(notFoundHandler);
// Middleware for handling other errors
app.use(errorHandler);
// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
