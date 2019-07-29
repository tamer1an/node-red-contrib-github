const express = require('express');
// const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpProxy = require('http-proxy');

const jsonParser = bodyParser.json();
const app = express();
const proxy = httpProxy.createProxyServer();

app.use(cors());
// app.use(fileUpload());
app.use(jsonParser);
app.get('/*', (req, res) => {
  proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
});

// app.post('/upload', server.upload);
// node-red port for nighthawk
app.listen(8888);
