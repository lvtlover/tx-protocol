// server.js
// where your node app starts

// init project
const url = require("url");
const axios = require("axios");
const fs = require('fs');
const express = require("express");
const app = express();
var endPoints={};

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
readEndpointConfig();
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/tx/*", async function(req, res) {
  var path = req.path;
  var protocol = req.query.p;
  console.log(protocol);
  var tx = path.substring(path.lastIndexOf("/") + 1);
  if(typeof protocol === 'undefined'){
   protocol = await getProtocol(tx);
  }
  if( protocol!=null ){
    var ret = await handleEndpoints(res,protocol,tx);
    
    if(ret==true){ //handle protocl configed with endpoints
      return;
    }
    ret = await handleProtocolByJS(res,protocol,tx);
    if(ret == true){
      return;
    }
    
  };
  if(protocol!=null)
    res.end("handler not found for protocol:" + protocol);
  else
    res.end("handler not found for protocol:" + protocol);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

async function handleProtocolByJS(res,protocol,tx){
  console.log("in handleProtocolByJS");
  var name = __dirname+"/protocols/"+protocol+"/handler.js";
  var jsHandle ;
  try{
  jsHandle = require(name);
  }catch(e){return false;}
  console.log(jsHandle);
  var out = await getOut(tx);
  console.log(out);
  if(out==null) return false;
  if(jsHandle!=null){
    jsHandle.handle_out(res,out,tx);
    return true;
  }
  
}
async function handleEndpoints(res,protocol,tx){
  
 // console.log(protocol);
  if(protocol in endPoints){
    
      var ep = endPoints[protocol];
      ep = ep.replace("%s",tx);
      console.log(ep);
      var res1 = await axios.get(ep,{
        method: "GET",
        responseType: "stream"});
      //console.log(res1.headers);
      res.set(res1.headers);
      //res.send(res1.data);
      res1.data.pipe(res);
      return true;
  }
  
  return false;
}
function readEndpointConfig(){
//  endPoints.set("19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", "https://bico.media/%s"); //B protocol
//	endPoints.set("19iG3WTYSsbyos3uJ733yK4zEioi1FesNU","https://bico.media/%s"); //D protocol
//	endPoints.set("15DHFxWZJT58f9nhyGnsRBqrgwK4W6h4Up","https://bico.media/%s"); //bcat
//	endPoints.set("moneybutton.com","https://bico.media/%s");
  var config = __dirname+"/protocols/endpoints.json";
  var data = fs.readFileSync(config);
  endPoints = JSON.parse(data);
  console.log(endPoints);
}
async function getOut(tx){
  var sQuery = {
    v: 3,
    q: {
      find: {}
    }
  };
  sQuery.q.find["tx.h"] = tx;
  var data = await bitQuery(sQuery);
  if(data.c.length>0)
    return data.c[0].out;
  if(data.u.length>0)
    return data.u[0].out;
  return null;
}
async function getProtocol(tx) {
  var sQuery = {
    v: 3,
    q: {
      find: {},
      project: {
        "out.b0": 1,
        "out.b1": 1,
        "out.s1": 1,
        "out.s2": 1
      }
    }
  };
  sQuery.q.find["tx.h"] = tx;
  var data = await bitQuery(sQuery);
  var b0 = 0,
    b1 = 0;
  var s1 = "",
    s2 = "";
  var db = data.u;
  
  if(db.length==0) db = data.c;
  
  try {
    b0 = db[0].out[0].b0.op;
  } catch (e) {}
  try {
    b1 = db[0].out[0].b1.op;
  } catch (e) {}
  try {
    s1 = db[0].out[0].s1;
  } catch (e) {}
  try {
    s2 = db[0].out[0].s2;
  } catch (e) {}
  console.log(data);
  if (b1 == 106) return s2;
  if (b0 == 106) return s1;
  return null;
}
async function bitQuery(query) {
  const BITDB_QUERY_ENDPOINT =
    "https://neongenesis.bitdb.network/q/1HcBPzWoKDL2FhCMbocQmLuFTYsiD73u1j/";
  const BITDB_API_KEY = "1EsSztGmvhcB62arZR5HaaHCYVb3G31pSu";

  var query_url =
    BITDB_QUERY_ENDPOINT +
    Buffer.from(JSON.stringify(query)).toString("base64");

  // Attach API KEY as header
  var options = {
    headers: { key: BITDB_API_KEY }
  };
  var res = await axios.get(query_url, options);
  return res.data;
}
