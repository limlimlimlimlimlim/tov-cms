'use client';

import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = () => {
  const socket = useRef<Socket>();

  useEffect(() => {
    if (socket.current) return;
    const socketIO = io(
      `${window.location.protocol}//${window.location.hostname}:3001`,
    );

    socketIO.on('connect', () => {
      console.log('Connected to server');
    });

    // socketIO.on('sync', (data) => {
    //   console.log('Received message from server:', data);
    // });

    socket.current = socketIO;

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return {
    socket: socket.current,
  };
};

export default useSocket;
