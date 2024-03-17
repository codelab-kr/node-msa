import net from 'net';

const options = {
   port: 3000,
   host: 'localhost'
};

const client = net.connect(options, () => {
   console.log('connected');
   // client.write('world!\r\n');
});

client.on('data', (data) => {
   console.log(data.toString());
   client.end();
});

client.on('end', () => {
   console.log('disconnected');
}  );
