exports.handle_out = function(res,out,tx){
  var template = `<html>
<head><meta charset="utf-8"/></head>
<body>
<h3>链上数据:</H3>
<p>text:%s</p><p>txid:%t</p>
</body>
</html>`;
  var text = out[0].s4;
  var txid = tx;
  template = template.replace("%s",text);
  template = template.replace("%t",tx);
  res.end(template);
  console.log(text);
}