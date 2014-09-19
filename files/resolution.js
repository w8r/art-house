// JavaScript Document
function adaptRes()
{
	if (self.screen) { 
		width = screen.width
		height = screen.height
	}
	else if (self.java) { 
		var jkit = java.awt.Toolkit.getDefaultToolkit();
		var scrsize = jkit.getScreenSize(); 
		width = scrsize.width; 
		height = scrsize.height; 
	} 
	if ( width >= 1024 ) {		
		var hdr = document.getElementById("header");
		if( hdr )
		{
			hdr.style.backgroundImage = "url(img/top_bg_hi.jpg)";
			hdr.style.height = "200px";
		}
		var ftr = document.getElementById("footer");
		if( ftr )
		{
			ftr.style.height = "194px";
		}
		var lgt   = document.getElementById("logo");
		var flgt  = document.getElementById("flogo");
		var homl  = document.getElementById("home");
		var ml  = document.getElementById("mail");
		var mainmo = document.getElementById("mainswf" );
		
		if( lgt ) lgt.style.marginTop = "132px";
		if( flgt ) flgt.style.margin = "120px 0 0 0";
		if( homl ) homl.style.marginTop = "132px";
		if( ml ) ml.style.marginTop = "132px";	
		if( mainmo ) mainmo.className = "hires";
	}
}
