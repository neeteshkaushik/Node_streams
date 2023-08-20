const fs = require('fs/promises');
const {Readable} = require('stream');
/*
Time : 7.5s
Memory : 2.5GB
File size : 7.523431777954102 MB
*/
// (
//     async()=>{
//         console.time('writeMany');
//         const fieHandler = await fs.open('text.txt', 'w');
//         const numberOfWrites = 1000000;
//         for(let i = 0; i< numberOfWrites; i++){
//             const buff = Buffer.from(` ${i} `, 'utf-8');
//             fieHandler.write(buff);
//         }
//         const fileSizes = await fieHandler.stat();
//         console.log(` file size in MB ${fileSizes.size/(1024*1024)}`);
//         await fieHandler.close();
//         console.timeEnd('writeMany');
//     }
// )()


/*
Time : 500ms
Memory : 240 MB
File size : 7.523431777954102 MB
*/
// (
//     async()=>{
//         console.time('writeMany');
//         const fileHandler = await fs.open('text.txt', 'w');
//         const numberOfWrites = 1000000;
//         const writeStream  = fileHandler.createWriteStream()
//         const readSource = new Readable({
//             read(){
//                 for(let i = 0; i< numberOfWrites; i++){
//                     const buff = Buffer.from(` ${i} `, 'utf-8');
//                    this.push(buff);
//                 }
//                 this.push(null);
//             }
//         })
//         const res = readSource.pipe(writeStream);
//         writeStream.on('finish', async () => {
//             const fileStat = await fileHandler.stat();
//             console.log(`file size in MB ${fileStat.size / (1024 * 1024)}`);
//             console.timeEnd('writeMany');
//         });
//     }
// )()


// /*
// Time : 400ms
// Memory : 47 MB
// File size : 7.523431777954102 MB
// */



(
    async()=>{
        console.time('writeMany');
        const fileHandler = await fs.open('text.txt', 'w');
        const numberOfWrites = 10000000;
        const writeStream  = fileHandler.createWriteStream()
        let i = -1;
        function writeMany() {
            while(i < numberOfWrites){
                ++i;
                const buff = Buffer.from(` ${i} `, 'utf-8');
                if( i === numberOfWrites - 1){
                    writeStream.end(buff);
                    break;
                }
                if(!writeStream.write(buff)) break;
                
            }
        }
        writeMany();
        writeStream.on('drain', ()=>{
            writeMany();
        })
        writeStream.on('finish', async () => {
            const fileStat = await fileHandler.stat();
            console.log(`file size in MB ${fileStat.size / (1024 * 1024)}`);
            console.timeEnd('writeMany');
        });
    }
)()
