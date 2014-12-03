var addEvent = function addEvent(element, eventName, func) {
    if (element.addEventListener) {
        return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

window.onload = function(){
    var chardinJS = new ChardinJs(document.body);

    var toggles = document.querySelectorAll('[data-toggle-chardinjs]');
    for(var i=0;i<toggles.length;i++){
        addEvent(toggles[i],'click',function(e){
            e.preventDefault();
            var image = document.getElementsByClassName('showcase-image')[0];
            if (image && chardinJS.isOpened){
                image.style.height = '0';
            } else {
                image.style.height = 'auto';
            }

            chardinJS.toggle();
        },false);
    }

    addEvent(document,'ChardinJs:stop',function(e){
        var image = document.getElementsByClassName('showcase-image')[0];
        image.style.height = '0';
    });
};