var express = require('express'),
    httpProxy = require('http-proxy'),
    proxy = httpProxy.createProxyServer({}),
    app = express();

app.use(express.static('.'));

// app.all('/*', function(req, res){
//     req.url = req.url.substr(4);
//     proxy.web(req, res, { target: 'http://localhost:3333' });
// });

app.listen(9000, function(){
    console.log('Server started!');
});
