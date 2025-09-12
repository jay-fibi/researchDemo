const http = require('http');
const port = 3000;

let crashMode = false;
let disconnectMode = false;

const server = http.createServer((req, res) => {
    if (req.url === '/crash') {
        crashMode = true;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Crash mode activated. Next request will crash the server.\n');
        return;
    }

    if (req.url === '/disconnect') {
        disconnectMode = true;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Disconnect mode activated. Next request will disconnect.\n');
        return;
    }

    if (req.url === '/reset') {
        crashMode = false;
        disconnectMode = false;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Modes reset. Server operating normally.\n');
        return;
    }

    if (crashMode) {
        console.log('Server crash simulated - exiting process');
        process.exit(1);
    }

    if (disconnectMode) {
        console.log('Server disconnect simulated - closing connection without response');
        req.destroy();
        return;
    }

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Server is running normally\n');
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available endpoints:');
    console.log('  GET / - Normal response');
    console.log('  GET /crash - Simulate server crash');
    console.log('  GET /disconnect - Simulate disconnect');
    console.log('  GET /reset - Reset crash/disconnect modes');
});

process.on('SIGINT', () => {
    console.log('Server shutting down gracefully');
    server.close();
});
