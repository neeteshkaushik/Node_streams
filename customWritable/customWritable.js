const fs = require('node:fs');
const {Writable} = require('node:stream');

class CustomWriteStream extends Writable {
    constructor({fileName, highWaterMark = 16384}){
        super({highWaterMark});
        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }
    _construct(callback){
        fs.open(this.fileName, 'w', (err, fd)=>{
            if(err)
            return callback(err);
            this.fd = fd;
            callback();
        })
    }
     
    _write(chunk, encoding, callback){
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;
        if(this.chunksSize >= this.highWaterMark){
            const buff = Buffer.concat(this.chunks);
            fs.write(this.fd, buff, (err)=>{
                if(err)
                return callback(err);
                this.chunks = [];
                this.chunksSize = 0;
                callback();
            })
        } else {
            callback();
        }
    }

    _final(callback){
        if(this.chunksSize > 0){
            fs.write(this.fd, Buffer.concat(this.chunks), (err)=>{
                if(err)
                return callback(err);
                this.chunks = [];
                this.chunksSize = 0;
                callback();
            })
        } else {
            callback()
        }
    }
    
    _destroy(err, callback){
        if(this.fd){
            fs.close(this.fd, (error)=>{
                callback(err || error);
            })
        } else {
            callback(err);
        }
    }
}

const writeStream = new CustomWriteStream({fileName: 'dest.txt'});

writeStream.write('hello ');
writeStream.write('world');
writeStream.end('!');

writeStream.on('finish', ()=>{
    console.log('Done');
})