(function(w, d, unused) {

var mins = 0
,   tot  = 0;
  
var running  = false
,   flashing = false
,   flash    = false;

var idTimer, idFlash;

w.onload = function() {
    d.getElementById('btn_start').onclick = toggleTimer;
    d.getElementById('btn_flash').enable = function(b) {
        this.disabled = b? "" : "disabled";
        if (!b) {
            if (flashing) toggleFlash();
            
            this.style.color = "#aaaaaa";
            this.style.background = "#707070";
            this.onclick = undefined;
            
        } else {
            if (flashing) this.style.background = "#aa0000";
            
            this.style.color = "#ffffff";
            this.onclick = toggleFlash;
        }
    }
    d.getElementById('btn_flash').enable(false);
    w.open("d.html","LiveOutputWindow","width=600,height=450").onload
        = function() {
            var copy = d.getElementById('container').cloneNode(true);
            
            this.document.body.appendChild(copy);
            
            var that = this;
            w.d2 = w.d2 || this.document;
            w.onunload = w.onclose = function() {
                if (!that.closed) {
                    that.close();
                }
            };
        };
    d.getElementById('btn_alert').onclick = doAlert;
};

function initTimer() {
    var ti = d.getElementById('in_title');
    var mi = d.getElementById('in_minutes'); 
   
    if (!ti.value || mi.value <= 0 || ti.value.trim().length === 0) {
        alert("Inputs must not be empty and minutes must be greater than 0 !");
        return false;
    }
    
    mins = tot = parseInt(mi.value);
  
     for (var a = [d,d2], i = 0; i < a.length; i++) {
        a[i].getElementById('title').textContent = ti.value;
        a[i].getElementById('minutes').textContent = tot + "";
        a[i].getElementById('container').style.background = "url(green.png) 0% / 0% no-repeat";
        a[i].getElementById('minutes').style = "background:none;color:#ffffff";
     }
         
    return true;
}

function doTimer() {
    mins = mins - 1;  
    
    d.getElementById('minutes').textContent 
        = d2.getElementById('minutes').textContent = mins + "";
      
    if (mins >= 0) {     
        if (mins === 0) {
            d.getElementById('container').style.backgroundImage             
                = d2.getElementById('container').style.backgroundImage 
                    = "url(yellow.png)";
        }
        d.getElementById('container').style.backgroundSize       
            = d2.getElementById('container').style.backgroundSize 
                = 100*(tot-mins)/tot + "% 100%";
            
    } else if (mins === -1) {      
         d.getElementById('container').style.backgroundImage             
                = d2.getElementById('container').style.backgroundImage 
                    = "url(red.png)";       
         d.getElementById('btn_flash').enable(false);
         toggleFlash();
         d.getElementById('btn_flash').enable(true);
    }    
}

function toggleTimer() {
    if (running) {         
        d.getElementById('btn_flash').enable(false);
        clearInterval(idTimer);        
        d2.getElementById('container').style.visibility = "hidden";       
        // Show static seconds counter
        d.getElementById('seconds').src = "seconds.png";         
        initTimer();       
        this.value = "START";
        this.style.backgroundColor = "#00aa00";
        running = false;
      
    } else if (initTimer()) {
        idTimer = setInterval(doTimer, 60000); 
        d2.getElementById('container').style.visibility = "visible";        
        // Show dynamic seconds counter
        d.getElementById('seconds').src = "seconds.gif";          
        this.value = "STOP";
        this.style.backgroundColor = "#aa0000";
        running = true;
    }
    
    return false;  
}

function doFlash() {
    d.getElementById('minutes').style
        = d2.getElementById('minutes').style
            = ((flash = !flash)? "background:#ffffff; color:#ee0000" : "background:none");
}

function toggleFlash() {
    if (flashing) {
        clearInterval(idFlash); 
        if (this.style)  this.style.backgroundColor = "#707070";           
    } else {
        idFlash = setInterval(doFlash, 300);  
        if (this.style) this.style.backgroundColor = "#aa0000";     
    }    
    flashing = !flashing;
      
    return false;
}

function doAlert() {
    this.blur();
    var msg = w.prompt("Please enter a message that you want to use for the alert:");
    if (msg && msg.trim().length) {
        
        var div = d.createElement('div');
        var gif = d.createElement('img');
        var txt = d.createElement('div');
        
        txt.textContent = msg;
        
        gif.setAttribute('src','attention.gif');
        div.setAttribute('class','alert-filter');
             
        div.appendChild(gif);
        div.appendChild(txt);
                  
        div.ondblclick = function () {
            this.parentNode.removeChild(this);
            d2.body.removeChild(d2.body.lastChild);
            return false;
        };
    
        d.body.appendChild(div);
        d2.body.appendChild(div.cloneNode(true));
        div.setAttribute('title','Double click to close');
    }
    
    return false;
}

/*function triggerClick(elId) {
    var evt;
    var el = d.getElementById(elId);
    el.disabled = "";
    if (d.createEvent) {
        evt = d.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, w, 0, 0, 0, 0, 0, false, false
            , false, false, 0, null);
    }
    (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
}*/

})(window, window.document);