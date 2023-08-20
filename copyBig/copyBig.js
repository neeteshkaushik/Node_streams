const fs = require('fs/promises');


// File size : 84 MB
// Memory used 95 MB
// Time 90 ms
//
// (
//     async()=>{
//         const useSetInterval = false;
//         console.time('copy');
//         const readFileHandler = await fs.open('big.txt', 'r');
//         const writeFileHandler = await fs.open('dest.txt', 'w');
//         const content = await readFileHandler.readFile();
//         await writeFileHandler.writeFile(content);
//         await readFileHandler.close()
//         await writeFileHandler.close()
//         console.timeEnd('copy');
//         if(useSetInterval){
//             setInterval(()=>{
//                 // console.log(process.memoryUsage().heapUsed / 1024 / 1024);
//             }
//             , 1000);
//         }
//     }
// )()






// File size : 84 MB
// Memory used 27 MB
// Time 60 ms
// (
//     async()=>{
//         const useSetInterval = true;
//         console.time('copy');
//         const readFileHandler = await fs.open('big.txt', 'r');
//         const writeFileHandler = await fs.open('dest.txt', 'w');
//         const readStream = readFileHandler.createReadStream();
//         const writeStream = writeFileHandler.createWriteStream();
//         readStream.on('data',(chunk)=>{
//             if(!writeStream.write(chunk)){
//                 readStream.pause();
//             }
//         })
//         writeStream.on('drain',()=>{
//             readStream.resume();
//         })
//         readStream.on('end',async()=>{
//             const fileStat = await writeFileHandler.stat();
//             const fileSize = fileStat.size;
//             console.log(`File size : ${fileSize / (1024 * 1024)} MB`);
//             console.timeEnd('copy');
//             setInterval(()=>{},1000);
//         })
//     }
// )()





// File size : 84 MB
// Memory used 27 MB
// Time 66 ms
// (
//     async()=>{
//         console.time('copy');
//         const readFileHandler = await fs.open('big.txt', 'r');
//         const writeFileHandler = await fs.open('dest.txt', 'w');
//         const readStream = readFileHandler.createReadStream();
//         const writeStream = writeFileHandler.createWriteStream();
//         readStream.pipe(writeStream); // pipe takes care of pause and resume(back pressure)
//         readStream.on('end',async()=>{
//             await readFileHandler.close()
//             await writeFileHandler.close()
//             console.timeEnd('copy');

//         })
//     }
// )()


// improved version with error handling
// (
//     async () => {
//         console.time('copy');
//         let readFileHandler;
//         let writeFileHandler;

//         try {
//             readFileHandler = await fs.open('big.txt', 'r');
//             writeFileHandler = await fs.open('dest.txt', 'w');

//             const readStream = readFileHandler.createReadStream();
//             const writeStream = writeFileHandler.createWriteStream();

//             // Handle errors on both streams
//             readStream.on('error', handleError);
//             writeStream.on('error', handleError);

//             readStream.pipe(writeStream);

//             readStream.on('end', async () => {
//                 console.timeEnd('copy');
//             });
//         } catch (error) {
//             handleError(error);
//         } finally {
//             if (readFileHandler) await readFileHandler.close();
//             if (writeFileHandler) await writeFileHandler.close();
//         }
//     }
// )();

// function handleError(error) {
//     console.error('An error occurred:', error);
// }





