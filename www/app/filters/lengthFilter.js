(function () {
    "use strict";

    angular
        .module('app')
        .filter("setLength", setLength);

    setLength.$inject = [];

    function setLength() {
        return function (text, length, side) {
        	if (!text) {
        		return "";
        	}

        	text = text.toString();
        	
            var newText = text;
            var textLength = text.length;
            var neededSpace = length - textLength;

            if (textLength > length) {
                newText = newText.substring(0, length);
            } else {

                if (side == 2) {
                    while (neededSpace > 0) {
                        newText = " " + newText;
                        neededSpace = neededSpace - 1;
                    }
                } else {
                    while (neededSpace > 0) {
                        newText = newText + " ";
                        neededSpace = neededSpace - 1;
                    }
                }
            }
            return newText;
        }
    }
})();