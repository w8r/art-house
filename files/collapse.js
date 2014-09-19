// JavaScript Document
function initFoldables()
{
	if (!document.getElementsByTagName) return false;
	var gals = document.getElementsByTagName( "div" );
	var ls = 0;
	for( var i = 0; i < gals.length; i++ )
	{
		if ( gals[i].className.match( "minigallery" ) ) {
			 var ButFold =  gals[i].getElementsByTagName("div")[0];
			 gals[i].id = "fold" + ls + "w";
			 ButFold.id = "fold" + ls;
			 ls++;
      		 ButFold.onclick = function() {
        		FoldUnFold( this );
			}
		}
    }	
}

function FoldUnFold( Elem )
{	
	var cvis = document.getElementById( Elem.id + "w" );
	var imgs = cvis.getElementsByTagName( "img" );
	for( var i = 0; i < imgs.length; i++ )
	{		
		if( !imgs[i].style.display.match( "none" ) )
		{
			imgs[i].style.display = "none";
		} else {
			imgs[i].style.display = "block";
		}		
	}	
}
