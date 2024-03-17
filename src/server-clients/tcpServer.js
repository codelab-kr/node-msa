import net from 'net';

const server = net.createServer((socket) => {
    socket.end('Hello World\n');
});

server.on('error', (err) => {
   console.error(err);
});

server.listen(3000, () => {
   console.log('opened server on', server.address());
});