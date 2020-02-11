exports.handle_out = function(res,out,tx){
  var template = `<html>
<body>
<h3>MPoints Transaction details</H3>
<p>AppName:%s</p><p>txid:%t</p><p>details:%d</p>
</body>
</html>`;
  var appname = out[0].s3;
  var txid = tx;
  var details = JSON.stringify(out);
  template = template.replace("%s",appname);
  template = template.replace("%t",tx);
  template = template.replace("%d",details);
  res.end(template);
  console.log(out);
}