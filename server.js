/**
 * @file Configuration file for the server.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import http from 'http';
// eslint-disable-next-line node/no-unpublished-import
import './config';
// eslint-disable-next-line node/no-unpublished-import
import app from './app';

/**
 * @description If given port is a positive number, then it is returned as a number.
 * If given port is not a positive number, then it returns given port.
 *
 * @param   {string}        val - The value of the port that we want to normalize.
 * @returns {string|number}     The port number.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (!Number.isNaN(port) && port >= 0) {
    return port;
  }

  return val;
};
const port = normalizePort(process.env.PORT || '3000');

// @ts-ignore
app.set('port', port);

// @ts-ignore
const server = http.createServer(app);

/**
 * @description If given error isn't a syscall error, then it throws given error.
 * If it is a syscall error, then if the error code is 'EACCES' or 'EADDRINUSE', it throws a verbose error.
 * If it is a syscall error, but the error code isn't 'EACCES' or 'EADDRINUSE', it throws given error.
 *
 * @param {Error} error - The given error.
 * @throws {Error} Error message.
 */
const errorHandler = (error) => {
  // @ts-ignore
  if (error.syscall !== 'listen') {
    throw error;
  }
  // eslint-disable-next-line no-use-before-define
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : port;
  // @ts-ignore
  switch (error.code) {
    case 'EACCES':
      throw new Error(`${bind} Pas de permissions.`);
    case 'EADDRINUSE':
      throw new Error(`Port ${bind} déjà utilisé.`);
    default:
      throw error;
  }
};

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : port;
  console.log(`🔍 Port en cours d'utilisation: ${bind}`);
});

server.listen(port);
