import { io, Socket } from 'socket.io-client';

export const connectSocket = (): Promise<Socket> =>
  new Promise((resolve, reject) => {
    try {
      const socket = io(`wss://${process.env.BACKEND_DOMAIN}`);
      socket.on('connect', () => {
        resolve(socket);
      });
    } catch (error) {
      reject(error);
    }
  });
