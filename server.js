const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

// multer插件配置：
//注册一个对象，dest里放的是上传的文件存储的位置，可以在当前目录下，建立一个static目录，上传的文件都放在这里
const upload = multer({dest: './static/'})

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    // res.header('Content-Type', 'video/mp4');
    res.header('Access-Control-Expose-Headers','access-control-allow-origin, etag, x-oss-request-id');
    if (req.method.toLowerCase() == 'options') {
        res.send(200);  // 让options尝试请求快速结束
    } else {
        next();
    }
});


//使用中间件，没有挂载路径，应用的每个请求都会执行该中间件。any表示接受一切，具体参考文档。
app.use(upload.any())

// body
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use('/static',express.static('static',{
    setHeaders:(res, urlPath, stat)=>{
        const extName=path.extname(urlPath).substr(1);
        if (fs.existsSync(urlPath)) { //判断本地文件是否存在
            var mineTypeMap={
                html:'text/html;charset=utf-8',
                htm:'text/html;charset=utf-8',
                xml:"text/xml;charset=utf-8",
                png:"image/png",
                jpg:"image/jpeg",
                jpeg:"image/jpeg",
                gif:"image/gif",
                css:"text/css;charset=utf-8",
                txt:"text/plain;charset=utf-8",
                mp3:"audio/mpeg",
                mp4:"video/mp4",
                ico:"image/x-icon",
                tif:"image/tiff",
                svg:"image/svg+xml",
                zip:"application/zip",
                ttf:"font/ttf",
                woff:"font/woff",
                woff2:"font/woff2",
            }
            if (mineTypeMap[extName]) {
                res.set({
                    'Content-Type': mineTypeMap[extName],
                })
            }
            }
    }
}))

// 跨域
app.use(cors())

app.get('/', (req, res) => {
    res.json({messge:'ok'});
})

app.post('/upload', (req, res) => {
    console.log(req.files)

    //拿到后缀名
    var extname = path.extname(req.files[0].originalname);

    //拼接新的文件路径，文件加上后缀名
    var newPath = req.files[0].path + extname;

    //重命名
    fs.rename(req.files[0].path, newPath, function(err){
        console.log(newPath);
        if(err){
            res.send('上传失败')
        }else{
            res.json({
                url:newPath
            })
        }
    })
})

app.listen(8081, () => console.log('server running!'))
