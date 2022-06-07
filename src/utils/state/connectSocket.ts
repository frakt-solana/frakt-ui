import { io, Socket } from 'socket.io-client';

export const connectSocket = (): Promise<Socket> =>
  new Promise((resolve, reject) => {
    try {
      const socket = io('wss://fraktion-monorep.herokuapp.com/');
      socket.on('connect', () => {
        resolve(socket);
      });
    } catch (error) {
      reject(error);
    }
  });
