'use strict';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { connectDB } from './config/db.connection';
import { Server } from 'socket.io';
import { getLivePoolCreateEvent } from './controllers/pool.controller';
import http from 'http';
import { getLiveTransactionsEvent } from './controllers/transaction.controller';

const app: Express = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// set security HTTP headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// enable cors
app.use(cors());
app.options('*', cors());
app.use('/api', router);

app.get('/', async (_: Request, res: Response) => {
  return res.json({ message: 'Welcome to UNISWAP V3 API' });
});

io.on('connection', async (socket) => {
  console.log('Client connected');
  await getLivePoolCreateEvent(socket);
  await getLiveTransactionsEvent(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, async () => {
  await connectDB();
  console.log('listening for requests on port 4000');
});
