exports.handle_out = function(res,out,tx){
  var template = `<html>
<head><meta charset="utf-8"/></head>
<body>
<h3>NBdomain onchain data:</H3>
<p>command:%c</p><p>data:%d</p>
<p>txid:<a href="http://www.whatsonchain.com/tx/%t">%t</p>
</body>
</html>`;
  var cmd = out[0].s4;
  var txid = tx;
  var s5 = out[0].s5;
  if(typeof s5 === 'undefined')s5 = out[0].ls5;
  if(cmd=="key"){
    var keyobj = JSON.parse(s5);
    template = template.replace("%c","key");
    //template = template.replace("%k",keyobj.key);
    template = template.replace("%d",s5);
  }
  if(cmd=="register"){
    template = template.replace("%c","register");
    template = template.replace("%d",out[0].s3);
  }
  if(cmd=="admins"){
    var keyobj = JSON.parse(out[0].s5);
    template = template.replace("%c","admins");
    template = template.replace("%d",out[0].s5);
  }
  if(cmd=="transfer"){
    var keyobj = JSON.parse(out[0].s5);
    template = template.replace("%c","transfer");
    template = template.replace("%d",s5);
  }
  if(cmd=="accept"){
    var keyobj = JSON.parse(out[0].s5);
    template = template.replace("%c","accept");
    template = template.replace("%d",s5);
  }
  template = template.replace("%t",tx);
  template = template.replace("%t",tx);
  res.end(template);
  return true;
}