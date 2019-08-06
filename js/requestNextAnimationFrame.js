window.requestNextAnimationFrame = (function(){
    var originWebkitMethod = undefined,
        callback = undefined,
        wrapper = undefined,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

        if(window.webkitRequestAnimationFrame){
        	  wrapper = function(time){
        	  	   if(time == undefined){
        	  	   	    time = + new Date();
        	  	   }
        	  	   self.callback(time);
        	  };
        	  originWebkitMethod = window.webkitRequestAnimationFrame;
        	  window.webkitRequestAnimationFrame = function(callback,element){
                  self.callback = callback;
                  originWebkitMethod(wrapper,element);
        	  };
        }

        if(window.mozRequestAnimationFrame){
        	  index = userAgent.indexOf('rv:');
        	  if(userAgent.indexOf('Gecko')!=-1){
        	  	    geckoVersion = userAgent.substr(index+3,3);
        	  	    if(geckoVersion === '2.0'){
        	  	    	window.mozRequestAnimationFrame = undefined;
        	  	    }
        	  }
        }

	return window.requestAnimationFrame ||
	       window.webkitRequestAnimationFrame ||
	       window.mozRequestAnimationFrame ||
	       window.msRequestAnimationFrame ||
	       function(callback,element){
	       	   var _self = this,
	       	       start,
	       	       finish;
	       	   window.setTimeout(function(){
	       	   	   start = +new Date();
	       	   	   callback(start);
	       	   	   finish = +new Date();
	       	   	   _self.timeout = 1000/60 - (finish - start);
	       	   },_self.timeout);
	       };

}());