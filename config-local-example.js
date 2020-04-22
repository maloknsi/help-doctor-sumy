const fs = require('fs');
let botServerUrl = 'https://viberbot20200120.meirc.sumy.ua';
let botAuthToken = '4aecd4df8327d02b-3c67a85e5bca68e7-daeefaf2e28780c7';//prod
let botServerPort = 8085;
const httpsOptions = {
    key: fs.readFileSync('./cert/viberbot20200120.meirc.sumy.ua-key.pem').toString(),
    cert: fs.readFileSync('./cert/viberbot20200120.meirc.sumy.ua-crt.pem').toString(),
    ca: fs.readFileSync('./cert/viberbot20200120.meirc.sumy.ua-chain.pem').toString(),
};
module.exports = {
    botServerUrl,
    botAuthToken,
    botServerPort,
    httpsOptions,
};
