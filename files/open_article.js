function doArticlePopUps() {
  if (!document.getElementById) {
	  return false;}
else {
  var links = document.getElementsByTagName("a");
  for (var i=0; i < links.length; i++) {
    if (links[i].className.match("openarticle")) { 
      links[i].onclick = function() {
        articlewin(this.getAttribute("href"), this.getAttribute("title"));
        return false;
      }
    }
  }
}
}
function articlewin( article_path , article_title )
{
    var str, StrBody;
	//alert( article_path + ", " + article_title );
	str = 'resizable=no, scrollbars=yes,width=600,height=600,screenX=100,screenY=100,left=0,top=0,status=no';		
	var win_op = window.open( article_path, article_title, str);
	win_op.focus();
}
// JavaScript Document
