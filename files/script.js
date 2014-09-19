RPaddEvent(window, 'load', RPchekSite);

function RPaddEvent(elem, evType, fn) {
        if (elem.addEventListener) {
                elem.addEventListener(evType, fn, false);
                return fn;
        }
        iefn = function() { fn.call(elem) }
        elem.attachEvent('on' + evType, iefn);
        return iefn;
}

function RPchekSite() {
        jQuery('#p7a1').click(function() {
                open('http://www.statedevelopment.ru/project');
        });
        if(jQuery.browser.msie && jQuery.browser.version == '7.0') {
                jQuery('a[href=#whom]').click(function() { divContentMarginLeft(1) });
                jQuery('a[href=#where]').click(function() { divContentMarginLeft(2) });
                jQuery('a[href=#what]').click(function() { divContentMarginLeft(3) });
                jQuery('a[href=#who]').click(function() { divContentMarginLeft(4) });
                jQuery('a[href=#news]').click(function() { divContentMarginLeft(5) });
                jQuery('a[href=#company]').click(function() { divContentMarginLeft(6) });
                jQuery('a[href=#contacts]').click(function() { divContentMarginLeft(7) });
                jQuery('a[href=#promo]').click(function() { divContentMarginLeft(8) });
        }
}

function divContentMarginLeft(num) {
        jQuery('div#content').css("marginLeft","-"+(1001*num)+"px");
}
/*
function RPgoP2() {
        document.title = '23';
        var p = document.getElementById('content');
        p.style.marginLeft = "-1001px";
        //p.scrollLeft = 500;
        return false;
}
*/
