const startDcfwy = require('./src/proxy.js');

// Proxy sunucusunu başlat
const proxyInstance = new startDcfwy();
proxyInstance.startServer();