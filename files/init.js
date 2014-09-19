// Make a scrollBar object and build one on screen
window.onload = init;

function init()
{
        adaptRes();
        initDHTMLAPI();
        initDrag();
        initScrollbars();
        initTitle();
        initFoldables();
        doArticlePopUps();
}

function initScrollbars() {
  scrollBars[0] = new scrollBar("gWin01", "oWrap01", "iWrap01", "#aaa");
  scrollBars[0].appendScroll();
  scrollBars[1] = new scrollBar("gWin02", "oWrap02", "iWrap02", "#aaa");
  scrollBars[1].appendScroll();
  scrollBars[2] = new scrollBar("gWin03", "oWrap03", "iWrap03", "#aaa");
  scrollBars[2].appendScroll();
  scrollBars[3] = new scrollBar("gWin04", "oWrap04", "iWrap04", "#aaa");
  scrollBars[3].appendScroll();
}

function initTitle() {
        var pr = document.getElementById( "promoplayer" );
        pr.onmouseover = setTitle;
        pr.onmousemove = setTitle;
}

function setTitle()
{
        document.title = "ART XAYS";
}
