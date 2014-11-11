(function (window) {
    'use strict';
    var variables = { // use for javascript variables such as responsive screen sizes, or detecting different browsers/mobile devices
        xs: "480",
        sm: "768",
        md: "992",
        lg: "1200"
    };

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        variables.isMobile = true;
    } else {
        variables.isMobile = false;
    }

    if (/iPad/i.test(navigator.userAgent)) {
        variables.isIpad = true
    }

    window.var = variables

})(window);