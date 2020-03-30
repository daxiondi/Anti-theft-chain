const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

const getHostName = function (str) {
    let {hostname} = url.parse(str);
    return hostname;
}

http.createServer((req, res) => {
    let refer = req.headers['referer'] || req.headers['referrer'];
    console.log("refer"+refer);
    // 先看refer的值，去和host的值作比对，不相等就需要防盗链
    // 要读取文件 返回给客户端

    let {pathname} = url.parse(req.url);
    let src = path.join(__dirname,'public','.'+pathname);
    
    //判断文件是否存在
    fs.stat(src, err=> {
        if(!err) {
            if(refer){ //不是所有请求都有refer
                let referHost = getHostName(refer);
                let host = req.headers['host'].split(':')[0];
                
                if(referHost !== host ){
                    //防盗链
                    fs.createReadStream(path.join(__dirname, 'public','./1.jpeg')).pipe(res);

                } else {
                    // 正常显示，如果路径存在，可以正常显示直接返回
                    fs.createReadStream(src).pipe(res);
                }
            } else {
                fs.createReadStream(src).pipe(res);
            }
        }else {
           
            res.end('end');
        }
    });
}).listen(9100);