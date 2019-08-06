var COREHTML5 = COREHTML5 || {};

COREHTML5.RoundRectangle = function(strokeStyle,fillStyle,
	                                horizontalSizePercent,verticalSizePercent){
     this.strokeStyle = strokeStyle || 'gray';
     this.fillStyle = fillStyle || 'skyblue';

     this.SHADOW_COLOR = 'rgba(100,100,100,0.8)';
     this.SHADOW_OFFSET_X = 3;
     this.SHADOW_OFFSET_Y = 3;
     this.SHADOW_BLUR = 3;
     this.setSizePercent(horizontalSizePercent,verticalSizePercent);

     this.createCanvas();
     this.createDOMElement();
     return this;
};
COREHTML5.RoundRectangle.prototype = {
	 createCanvas:function(){
	       var canvas = document.createElement('canvas');
	       this.context = canvas.getContext('2d');
	 },
	 createDOMElement:function(){
	 	   this.domElement = document.createElement('div');
	 	   this.domElement.appendChild(this.context.canvas);
	 },
	 setSizePercent:function(h,v){
	 	   this.horizontalSizePercent = h>1?h/100:h;
	 	   this.verticalSizePercent = v>1?v/100:v;
	 },
	 appendTo:function(element){
           element.appendChild(this.domElement);
           this.domElement.style.width = element.offsetWidth + 'px';
           this.domElement.style.height = element.offsetHeight + 'px';
           this.resize(element.offsetWidth,element.offsetHeight);
	 },
	 resize:function(width,height){
	 	   this.HORIZONTAL_MARGIN = (width - 
	 	   	                         width*this.horizontalSizePercent)/2;
	 	   this.VERTICAL_MARGIN = (height - 
	 	   	                         height*this.verticalSizePercent)/2;

	 	   this.left = this.HORIZONTAL_MARGIN;
	 	   this.top = this.VERTICAL_MARGIN;
	 	   this.right = this.left + width*this.horizontalSizePercent;
	 	   this.bottom = this.top + height*this.verticalSizePercent;

	 	   this.context.canvas.width = width;
           this.context.canvas.height = height;
	 },
	 fill:function(){
	 	   var radius = (this.bottom - this.top)/2;
	 	   this.context.save();
	 	   this.context.shadowColor = this.SHADOW_COLOR;
	 	   this.context.shadowOffsetX = this.SHADOW_OFFSET_X;
	 	   this.context.shadowOffsetY = this.SHADOW_OFFSET_Y;
	 	   this.context.shadowBlur = this.SHADOW_BLUR;
           
           this.context.beginPath();
	 	   this.context.moveTo(this.left+radius,this.top);
	 	   this.context.arcTo(this.right,this.top,
	 	   	          this.right,this.bottom,radius);
	 	   this.context.arcTo(this.right,this.bottom,
	 	   	          this.left,this.bottom,radius);
	 	   this.context.arcTo(this.left,this.bottom,
	 	   	          this.left,this.top,radius);
	 	   this.context.arcTo(this.left,this.top,
	 	   	          this.left+radius,this.top,radius);
	 	   this.context.closePath();
	 	   this.context.fillStyle = this.fillStyle;
	 	   this.context.fill();
	 	   this.context.shadowColor = undefined;
	 },
     overlayGradient:function(){
     	   var gradient = this.context.createLinearGradient(
     	   	              this.left,this.top,this.left,this.bottom);
           gradient.addColorStop(0,   'rgba(255,255,255,0.4)');
           gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)');
           gradient.addColorStop(0.25,'rgba(255,255,255,0.7)');
           gradient.addColorStop(0.3, 'rgba(255,255,255,0.9)');
           gradient.addColorStop(0.4, 'rgba(255,255,255,0.7)');
           gradient.addColorStop(0.45,'rgba(255,255,255,0.6)');
           gradient.addColorStop(0.6, 'rgba(255,255,255,0.4)');
           gradient.addColorStop(1,   'rgba(255,255,255,0.1)');

           this.context.fillStyle = gradient;
           this.context.fill();
           this.context.strokeStyle = this.strokeStyle;
           this.context.stroke();
           this.context.restore();
     },
     draw:function(context){
           var originalContext;
           if(context){
                 originalContext = context;
                 this.context = context;
           }
           this.fill();
           this.overlayGradient();
           if(context){
           	     this.context = originalContext;
           }
     },
     erase:function(){
     	   this.context.clearRect(0,0,
     	   	     this.context.canvas.width,this.context.canvas.height);
     }
};

COREHTML5.Progressbar = function(strokeStyle,fillStyle,
                                 width,height){
     this.trough = new COREHTML5.RoundRectangle(strokeStyle,fillStyle,
                                   width,height);
      
     this.SHADOW_COLOR = 'rgba(255,255,255,0.5)';
     this.SHADOW_BLUR = 3;
     this.SHADOW_OFFSET_X = 2;
     this.SHADOW_OFFSET_Y = 2;

     this.percentComplete = 0;
     this.createCanvas();
     this.createDOMElement();
     return this;
};

COREHTML5.Progressbar.prototype  ={
     createCanvas:function(){
           this.context = document.createElement('canvas').
                           getContext('2d');
           this.offscreen = document.createElement('canvas').
                           getContext('2d');
     },
     createDOMElement:function(){
           this.domElement = document.createElement('div');
           this.domElement.appendChild(this.context.canvas);
     },
     appendTo:function(element){
           element.appendChild(this.domElement);
           this.domElement.style.width = element.offsetWidth + 'px';
           this.domElement.style.height = element.offsetHeight + 'px';
           this.resize();
           this.trough.resize(element.offsetWidth,element.offsetHeight);
           this.trough.draw(this.offscreen);
     },
     resize:function(){
           var w = this.domElement.offsetWidth,
               h = this.domElement.offsetHeight;
           this.context.canvas.width = w;
           this.context.canvas.height = h;
           this.offscreen.canvas.width = w;
           this.offscreen.canvas.height = h;  
     },
     draw:function(percentComplete){
           this.percentComplete = percentComplete;

           if(percentComplete>0){
                 this.context.drawImage(this.offscreen.canvas,0,0,
                 this.context.canvas.width*percentComplete,
                 this.context.canvas.height,
                 0,0,
                 this.offscreen.canvas.width*percentComplete,
                 this.offscreen.canvas.height);
           }
     },
     erase:function(){
           this.context.clearRect(0,0,this.context.canvas.width,
                                 this.context.canvas.height);
     }
};
