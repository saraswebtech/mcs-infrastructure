/*
 * CircleType 0.34
 * Peter Hrynkow
 * Copyright 2013, Licensed GPL & MIT
 *
*/

var inputBox = document.getElementById('chatinput');
var cypher = document.getElementById('cypher');



$.fn.circleType = function(options) {

    var settings = {
        dir: 1,
        position: 'relative'
    };
    if (typeof($.fn.lettering) !== 'function') {
        console.log('Lettering.js is required');
        return;
    }
    return this.each(function () {
    
        if (options) { 
            $.extend(settings, options);
        }
        var elem = this, 
            delta = (180 / Math.PI),
            ch = parseInt($(elem).css('line-height'), 10),
            fs = parseInt($(elem).css('font-size'), 10),
            txt = elem.innerHTML.replace(/^\s+|\s+$/g, '').replace(/\s/g, '&nbsp;'),
            letters, 
            center;
        
        elem.innerHTML = txt
        $(elem).lettering();

        elem.style.position =  settings.position;

        letters = elem.getElementsByTagName('span');
        center = Math.floor(letters.length / 2)
                
        var layout = function () {
            var tw = 0, 
                i,
                offset = 0,
                minRadius, 
                origin, 
                innerRadius,
                l, style, r, transform;
                                                
            for (i = 0; i < letters.length; i++) {
                tw += letters[i].offsetWidth;
            }
            minRadius = (tw / Math.PI) / 2 + ch;
            
            if (settings.fluid && !settings.fitText) {
                settings.radius = Math.max(elem.offsetWidth / 2, minRadius);
            }    
            else if (!settings.radius) {
                settings.radius = minRadius;
            }   
            
            if (settings.dir === -1) {
                origin = 'center ' + (-settings.radius + ch) / fs + 'em';
            } else {
                origin = 'center ' + settings.radius / fs + 'em';
            }

            innerRadius = settings.radius - ch;
                
            for (i = 0; i < letters.length; i++) {
                l = letters[i];
                offset += l.offsetWidth / 2 / innerRadius * delta;
                l.rot = offset;                      
                offset += l.offsetWidth / 2 / innerRadius * delta;
            }   
            for (i = 0; i < letters.length; i++) {
                l = letters[i]
                style = l.style
                r = (-offset * settings.dir / 2) + l.rot * settings.dir            
                transform = 'rotate(' + r + 'deg)';
                    
                style.position = 'absolute';
                style.left = '50%';
                style.marginLeft = -(l.offsetWidth / 2) / fs + 'em';

                style.webkitTransform = transform;
                style.MozTransform = transform;
                style.OTransform = transform;
                style.msTransform = transform;
                style.transform = transform;

                style.webkitTransformOrigin = origin;
                style.MozTransformOrigin = origin;
                style.OTransformOrigin = origin;
                style.msTransformOrigin = origin;
                style.transformOrigin = origin;
                if(settings.dir === -1) {
                    style.bottom = 0;
                }
            }
            
            if (settings.fitText) {
                if (typeof($.fn.fitText) !== 'function') {
                    console.log('FitText.js is required when using the fitText option');
                } else {
                    $(elem).fitText();
                    $(window).resize(function () {
                        updateHeight();
                    });
                }
            }    
            updateHeight();
        };
        
        var getBounds = function (elem) {
        	var docElem = document.documentElement,
        	    box = elem.getBoundingClientRect();
	        return {
		        top: box.top + window.pageYOffset - docElem.clientTop,
		        left: box.left + window.pageXOffset - docElem.clientLeft,
		        height: box.height
	        };
        };        
        
        var updateHeight = function () {
            var mid = getBounds(letters[center]),
                first = getBounds(letters[0]),
                h;
            if (mid.top < first.top) {
                h = first.top - mid.top + first.height;
            } else {
                h = mid.top - first.top + first.height;
            }
            elem.style.height = h + 'px';  
        }

        if (settings.fluid && !settings.fitText) {
            $(window).resize(function () {
                layout();
            });
        }    

        if (document.readyState !== "complete") {
            elem.style.visibility = 'hidden';
            $(window).ready(function () {
                elem.style.visibility = 'visible';
                layout();
            });
        } else {
            layout();
        }
    });
};


$('#cypher').circleType({position: 'absolute'});

var ref = "abcdefghijklmnopqrstuvwxyz&@!$012345678"


                
$('#cpw').keyup(function(e) {
   // cancel if the key pressed is not a character
   if(e.key.length !== 1) { 
     return false;
   };
   var rf;
   var input = document.getElementById('cpw').value;
   var char = input.charAt(input.length - 1);
   var charNotSymbol = ['$','&','!','@'].indexOf(char) == -1;
  
   if(e.shiftKey) {
     rf = ref.toUpperCase();
     if(charNotSymbol) {
       $('#cypher').addClass("uppercase");
     }
   } else {
     if(charNotSymbol) { 
       $('#cypher').removeClass("uppercase") 
     };
     rf = ref; 
   }
  
  
   $('span').removeClass("active");
    var rotated = false;
    var orig = 175;
    var output = document.getElementById('output');
    var char_index = rf.indexOf(char);
    var rote_to = 175 - ((360 / ref.length) * char_index) ;
// output.innerHTML = char_index + " " + char + " " + input + " " + rote_to;
    deg = rote_to;

     // TO DO: separate rotation function and rotate to zero after a       timeout. 
    cypher.style.webkitTransform = 'rotate('+deg+'deg)'; 
    cypher.style.mozTransform    = 'rotate('+deg+'deg)'; 
    cypher.style.msTransform     = 'rotate('+deg+'deg)'; 
    cypher.style.oTransform      = 'rotate('+deg+'deg)'; 
    cypher.style.transform       = 'rotate('+deg+'deg)'; 

    //change letter color 
    var char_ix = (char_index + 1).toString();
    function changeColor() { 
    $('.char' + char_ix).addClass("active");
    };
    setTimeout(changeColor, 0)
    // rotated = !rotated;
});

