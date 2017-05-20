var pangolin = require('pangolin');
pangolin.connect({
  remoteHost : '123.207.252.230',  //Server IP address
  remotePort : 80,        //Server TCP port
  localHost  : '127.0.0.1',  //Local web app IP address
  localPort  : 2333,         //Local web app port
  showAccessLog : true     //Display logs or not
});
console.log('请不要忘记登录你的服务器并输入:sudo pangolin server -p 79')