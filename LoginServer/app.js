var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('3_zzxgame.com.cn.key');
var certificate = fs.readFileSync('2_zzxgame.com.cn.crt');
var credentials = {
    ssl: true,
    port: 18800,
    key: privateKey,
    cert: certificate
};

var httpServer = http.createServer(app);
var PORT = 18800;

httpServer.listen(PORT, function() {
    console.log('HTTP Server is running on: http://www.zzxgame.com.cn:%s', PORT);
});

var httpsServer = https.createServer(credentials, app);
var SSLPORT = 18801;

httpsServer.listen(SSLPORT, function() {
    console.log('HTTPS Server is running on: https://www.zzxgame.com.cn:%s', SSLPORT);
});

var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Welcome
app.get('/', function(req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});

app.post('/test', urlencodedParser, function(req, res) {
    //console.log(req);
    console.log(req.query.id);
    console.log(req.query.name);
    res.send('Welcome!ID:' + req.query.name + ',name:' + req.query.name);
});

app.post('/token', urlencodedParser, function(request, response) {
    console.log(request.query.code);
    var wxUrl = "https://api.weixin.qq.com/sns/jscode2session?appid=wxa73be54be6dafecf&secret=5bb1065b49f1557f0f8c4f794644cffb&js_code=" + request.query.code +"&grant_type=authorization_code";
    console.log("redirect" , wxUrl);
    //res.redirect(wxUrl);
    var content = '';
    var req = https.request(wxUrl, function(res) {  
        res.on('data',function(body){  
            console.log('return');  
            content+=body;  
        }).on("end", function () {  
            //response.writeHead(200, {'Content-Type': 'text/html'});  
            response.write(content);  
            response.end();  
        });  
    }).on('error', function(e) {  
        console.log("Got error: " + e.message);  
    });  
    req.end();
});