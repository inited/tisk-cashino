(function () {
    "use strict";

    angular
        .module('app')
        .filter("wrap", wrap);

    wrap.$inject = [];

    function wrap() {
        return function (txt, len) {
			console.log("Wrapping text " + txt + " with length " + len);
        	if (!txt) {
        		return "";
        	}
        	
        	var i=0;
        	var j=0;
        	var floor = 0;
        	
        	do {
        		j=i;
        		i=txt.indexOf(" ", i + 1);
        		if (i<0) {
        			i=txt.length;
        		}
        		if ((i - floor) > len) {
        			txt = txt.substr(0,j) + "<br>" + txt.substr(j+1);
        			floor = j + 1;
        		}
        		
        	} while(i < txt.length);
        	return txt;
        }
    }
})();