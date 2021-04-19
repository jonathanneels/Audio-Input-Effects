const https = require('https');
//const http = require('http');
 const fs = require('fs');
var os = require( 'os' );

const options = {
  key: fs.readFileSync('testkey.pem'),
  cert: fs.readFileSync('test.crt')//cert.pem
};

 var port = 9099;
 var ip= "127.0.0.1";
 require('dns').lookup(require('os').hostname(), function (err, add, fam) {
 // console.log('addr: '+add);
  ip = add; // if netwerk allows it - Windows  Firewall - https://stackoverflow.com/questions/5489956/how-could-others-on-a-local-network-access-my-nodejs-app-while-its-running-on/5490033
 	console.log("HTTPS server started at https://"+ip+":" + port.toString());
	
	launchServer();
	
});

function launchServer(){
https.createServer(options, function (req, res) { 
  if (req.url === '/') {//REF: https://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(res);
    } else if (req.url === '/test'){
	console.log("hello world");
  res.writeHead(200);
  res.end("hello world\n");} 
  else if (req.url.includes( '/list')){
	  console.log(req.url);
	  var fileList= [];
	  fs.readdir(("."+req.url.replace("/list","/").trim()), (err, files) => { //REF: https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
	    files.forEach(file => { try{
			if(fs.statSync("."+req.url.replace("/list","/").trim()+"/"+file).isDirectory()){// REF: https://www.technicalkeeda.com/nodejs-tutorials/how-to-check-if-path-is-file-or-directory-using-nodejs
				console.log("dir:"+file);
				fileList.push("<a href='"+req.url+'/'+file+"'>"+file + "</a><br>");
			} 
				
			else{
    console.log(file);
 //fileList.push("<a href='https://"+  req.url.replace("/list",ip+":"+port )+"/"+file+"'>"+file + "</a><br>"); 
  fileList.push("<a href='"+  req.url.replace("/list","/GETFILE" )+"/"+file+"'>"+file + "</a><br>");}

  }catch(err){ 
    console.log("File not Found :("); // prevents server crash
	  return false; 
  }});  
res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fileList.join("")); }); 
  } else if (req.url .includes( '/GETFILE') )
  {
	  fs.readFile(__dirname + req.url.replace("GETFILE","") , function (err,data) {   
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
	  
  }
  else{  
  fs.readFile(__dirname + req.url, function (err,data) {//REF:https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  
  }
  
}).listen(port,"0.0.0.0");}
