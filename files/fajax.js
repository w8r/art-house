var awblockHTML;
var awblock;
var xmlHttp;

function createXmlHttpRequestObject(){
        var xmlHttp;
        if(window.ActiveXObject){
                try{ xmlHttp = new ActiveXObject("Microsoft.XMLHTTP"); }
                catch(e){ xmlHttp = false; }
        } else {
                try{ xmlHttp = new XMLHttpRequest(); }
                catch(e){ xmlHttp = false; }
        }
        if(!xmlHttp) alert("Отсуствует поддержка XMLHttpRequest");
        else return xmlHttp;
}

function fotoprogressText(){
        awblock.innerHTML = '<br><br><br><p>Введите ключ доступа:<br><br><input id="awblockPass" type="password"><br><br><input onClick="fotoprogressLoad();" type="button" value="Войти">&nbsp;&nbsp;<input onClick="fotoprogressOut();" type="button" value="Отмена"></p>';
}

function fotoprogress(){
        awblock = document.getElementById("awblock");
        awblockHTML = awblock.innerHTML;
        fotoprogressText();
}

function fotoprogressOut(){
        awblock.innerHTML = awblockHTML;
}

function fotoprogressLoad(){
        xmlHttp = createXmlHttpRequestObject();
        var awblockPass = encodeURIComponent(document.getElementById("awblockPass").value);
        if(xmlHttp.readyState == 4 || xmlHttp.readyState == 0){
                xmlHttp.open("GET", "load/data.php?"+awblockPass, true);
                xmlHttp.onreadystatechange = fotoprogressData;
                xmlHttp.send(null);
        }
}

function fotoprogressData()
{
        if(xmlHttp.readyState == 4){
                if(xmlHttp.status == 200){
                        if(xmlHttp.responseText != ''){
                                awblock.innerHTML = xmlHttp.responseText;
                                Lightbox.prototype.updateImageList();
                        } else fotoprogressText();
                } else alert("При обращении к серверу возникли проблемы " + xmlHttp.statusText);
        } else fotoprogressText();
}
