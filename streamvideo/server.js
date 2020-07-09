const http=require('http');
const fs=require("fs");
const path=require("path");
const server=http.createServer((req,res)=>{
    // return res.end(req.url+req.method);
    if(req.method==='GET' && req.url==="/"){
        // res.writeHead(200);
        fs.createReadStream(path.resolve("index.html")).pipe(res);
        return;
    }
    if(req.method==='GET' && req.url==="/video"){
        const filepath = path.resolve("video.mp4");
        const stat = fs.statSync(filepath)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1] ?parseInt(parts[1], 10) :fileSize - 1
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(filepath, {start,end})
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
          file.pipe(res);
        }else{
           const head = {
               'Content-Length': fileSize,
               'Content-Type': 'video/mp4',
           }
           res.writeHead(200, head);
           fs.createReadStream(path).pipe(res);
        }
    }
    else{
        res.writeHead(400);
        res.end("bad request");
    }
})


const PORT = process.env.PORT || 3000;
server.listen(PORT,() => {
  console.log(`server listening on port:${PORT}`);
})
