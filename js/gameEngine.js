function Point(x,y){
     this.x = x;
     this.y = y;
}

function object(o){
     function F(){}
     F.prototype = o;
     return new F();
}

function inheritPrototype(subType,superType){
     var prototype = object(superType.prototype);
     prototype.constructor = subType;
     subType.prototype = prototype;
}

function Game(name,canvasId){

     this.name = name;
	   this.canvas = document.getElementById(canvasId);
	   this.context = this.canvas.getContext('2d');
       
	   //rectangel
	   this.rank = 5;
	   this.row = 0;

	   //number           
	   this.numColors = ['#f31328','#f33991',"#f47dc9","#f410a1",
	                     '#f410ec',"#f98ff5","#e30cf6","#e379ec",
	                     '#b412f7','#9312f7',"#419ff6","#88c1f7",
	                     '#76e8f9',"#23f4bc","#06f733","#77f28e",
	                     '#41fc28','#28befc','#000','#fcbe28'];
	   this.offsetNum = [];
	   this.hideNum = [];
     this.offsetColor = [];
     this.hideColor  = [];

	   //animation
	   this.fsp = 0;
	   this.STARTING_FPS = 60;
	   this.startTime = 0;
	   this.gameTime = 60;
	   this.lastTime = 0;
	   this.pause = false;
     this.translateOffset = 0;
     this.velocity = 0;
     this.PAUSE_TIMEOUT = 100;

     //score
     this.HIGH_SCORE_SUFFIX= '_highscore';

     //remember have click number
     this.rememberNum = [];

     //time
     this.elementTime = null;
}

Game.prototype = {
       getRandom:function(num1,num2){
              return num2*Math.random() +num1;
       },

       //rectangle algorithm
       drawOffsetNum:function(translate){
       	       var count = 0;
               this.context.save();
               this.context.translate(0,translate+this.row*this.stepX);
               this.drawNums(this.offsetNum,count,this.offsetColor);
               this.context.restore();   
       },
       drawChangeOffsetNum:function(){
       	       var count = 0;
               this.context.save();
               this.drawChangeNum(this.offsetNum,count,this.offsetColor);
               this.context.restore();   
       },
       drawHideNum:function(translate){
       	       var count=this.row * this.rank;
       	       this.context.save();
               this.context.translate(0,translate);
               this.drawNums(this.hideNum,count,this.hideColor);
               this.context.restore();
       },
       drawChangeHideNum:function(){
       	       var count=this.row * this.rank;
       	       this.context.save();
               this.context.translate(0,-this.row*this.stepX);
               this.drawChangeNum(this.hideNum,count,this.hideColor);
               this.context.restore();
       },
       drawNums:function(array,count,colorArr){
       	      var i,k,
       	          height = this.canvas.height,
       	          width = this.canvas.width;
  
              for(i=0;i<height;i+= this.stepX){
                      for(k=0;k<width;k+=this.stepX){
                             //this.context.strokeRect(k,i,this.stepX,this.stepX);
                             this.context.fillRect(k,i,this.stepX,this.stepX);
                             this.drawNumbers(k,i,this.stepX,array[count],colorArr[count]);
                             count++;
             	       }
             	    
              }
              this.drawGrid(this.context);
       },
       drawChangeNum:function(array,count,colorArr){
              var i,k,strot,
       	          height = this.canvas.height,
       	          width = this.canvas.width;
              this.setNumberColors();
              for(i=0;i<height;i+= this.stepX){
                      for(k=0;k<width;k+=this.stepX){
                             //this.context.strokeRect(k,i,this.stepX,this.stepX);
                             this.context.fillRect(k,i,this.stepX,this.stepX);
                             strot = Math.round(this.getRandom(1,8));
                             this.drawNumbers(k,i,this.stepX,strot,colorArr[count]);
                             array[count] = strot;
                             count++;
             	       }
             	    
              }
              this.drawGrid(this.context);
       },
       drawGrid:function(context){
              for(var i=0;i<context.canvas.width;i+=this.stepX){
                    context.beginPath();
                    context.moveTo(i,0);
                    context.lineTo(i,context.canvas.height);
                    context.stroke();
              }
              for( i=0;i<this.row*this.stepX;i+=this.stepX){
                    context.beginPath();
                    context.moveTo(0,i);
                    context.lineTo(context.canvas.width,i);
                    context.stroke();
              }
       },
       exchangeNum:function(){
       	      var i,k,countO = 0,
       	          count=this.row * this.rank,
       	          height = this.canvas.height,
       	          width = this.canvas.width;
       	      this.clearScreen();
              for(i=0;i<height;i+= this.stepX){
       	             for(k=0;k<width;k+=this.stepX){
       	                    //this.context.strokeRect(k,i,this.stepX,this.stepX);
       	                    this.context.fillRect(k,i,this.stepX,this.stepX);
       	                    this.drawNumbers(k,i,this.stepX,this.hideNum[count]);
       	                    this.offsetNum[countO] = this.hideNum[count];
       	                    count ++;
       	                    countO++;
       		         }
       		    
       	      }
              this.drawGrid(this.context);
       },
       setNumberColor:function(){
              var stort = Math.round(this.getRandom(0,19));
              return this.numColors[stort];
       },
       setNumberColors:function(){
              var count = this.row*this.rank,stort,i;
              if(this.offsetColor.length===0){
                     for(i=0;i<count;i++){
                            stort = Math.round(this.getRandom(0,19));
                            this.offsetColor[i]=this.numColors[stort];
                     }
              }else{
                     for( i=0;i<this.row*this.rank;i++){
                            this.offsetColor[i]=this.hideColor[count];
                            count++;
                     }
                     count = this.row*this.rank;
                     
              }
              for(;count<2*this.row*this.rank;count++){
                    stort = Math.round(this.getRandom(0,19));
                    this.hideColor[count]=this.numColors[stort];
              }
       },
       drawNumber:function(k,i,stepX,stort){
              var numColor = this.setNumberColor();
              this.context.save();
              this.context.fillStyle = numColor;
              this.context.fillText(stort,k+stepX/2,i+stepX/2);
              this.context.restore();
       },
       drawNumbers:function(k,i,stepX,stort,color){
              this.context.save();
              this.context.fillStyle = color;
              this.context.fillText(stort,k+stepX/2,i+stepX/2);
              this.context.restore();
       },
       //animation  ................................................
       start:function(){
       	      this.stepX = Math.ceil(this.canvas.width/this.rank);
       	      this.row = Math.ceil(this.canvas.height/this.stepX);
              this.translateOffset = -this.row*this.stepX;
       	      this.drawChangeOffsetNum();
       	      this.drawChangeHideNum();
       	      this.updateTime(this.gameTime);
              var self = this;
              window.requestAnimationFrame(function(time){
                     self.animation.call(self,time);
              });
       },
       animation:function(time){
              var self = this;
		  	  if(this.pause){
		  	         setTimeout(function(){
	                        self.animation.call(self,time);
		  	         },this.PAUSE_TIMEOUT);
		  	  }else{
		  	    	 this.tick(time);
		  	    	 this.scrollBackground();
		  	    	 window.requestAnimationFrame(function(time){
	                        self.animation.call(self,time);
		  	    	 });
		  	    }
       },
       tick:function(time){
              this.updateFrameRate(time);
              if(time - this.startTime>=1000){
              	     
                     this.gameTime--;
                     this.updateTime(this.gameTime);
                     if(this.gameTime===0){
                            this.pause = true;
                            gameOverFunc();
                     }
                     this.startTime = time;
              }
       	      this.lastTime = time;
       },
       updateFrameRate:function(time){
       	      if(this.lastTime === 0){
       	             this.fps = this.STARTING_FPS;
       	             this.startTime = time;
       	      }else{
       	      	     this.fps = 1000/(time - this.lastTime);
       	      }        

       },
       clearScreen:function(){
       	      this.context.clearRect(0,0,
       	      this.canvas.width,this.canvas.height);
       },
       scrollBackground:function(){
       	      var translateDelta = parseFloat(this.pixelsPerFrame().toFixed(2));
              this.translateOffset = this.translateOffset+translateDelta;
              if(this.translateOffset>=0){

                     this.translateOffset = -this.row*this.stepX;
                     this.exchangeNum();
                     this.drawChangeHideNum();
              }else{ 
              	     this.clearScreen();
              	     this.drawOffsetNum(this.translateOffset);
       	             this.drawHideNum(this.translateOffset);
              }
              
       },
     //time
     togglePause:function(){
            this.pause = !this.pause;
	   },
	   pixelsPerFrame:function(){
              return this.velocity/this.fps;
	   },
	   updateTime:function(time){
             this.elementTime.innerHTML = time;
     },

	   //event
     getClickNum:function(x,y){

              if(y>this.canvas.height + this.translateOffset){
                    return this.checkInOffsetRect(x,y);
              }else{
             	      return this.checkInHideRect(x,y);
              }
     },
     checkInHideRect:function(x,y){
            var  height = this.canvas.height,
     	           width = this.canvas.width,
     	           Cx = Math.ceil((width - x)/this.stepX),
     	           Cy = (Math.ceil((height+this.translateOffset -y)/
     	          	            this.stepX)-1)*5,
     	           sum = 2*(this.row * this.rank);
                 this.rememberNum.push(sum -(Cx+Cy));

     	      return this.hideNum[sum -(Cx+Cy)];
     },
     checkInOffsetRect:function(x,y){
            var  height = this.canvas.height,
                 Cx = Math.floor(x/this.stepX),
 	               Cy = (Math.ceil((y-(height+this.translateOffset))/
 	          	            this.stepX)-1)*5;
                 this.rememberNum.push(Cx+Cy);
            return this.offsetNum[Cx+Cy];
     },
     //high score
     getHightScore:function(){
            var key = this.name + this.HIGH_SCORE_SUFFIX,
                highScore = localStorage[key];
            if(highScore === undefined){
                   localStorage[key] = 0;
            }
            return localStorage[key];
     },
     setHeightScore:function(score){
            var key = this.name + this.HIGH_SCORE_SUFFIX,
                highScore = localStorage[key];
            if(highScore<score||highScore === undefined){
                   localStorage[key] = score;
            }
     },
};

/**
 * *******************************************************
 * Number disapear 
 * *******************************************************
 */

function NumberDisper(name,canvasId){
        Game.call(this,name,canvasId);

        this.slipRowing = [];
        this.slipRowingDistance = 0;
        this.slipRowingTime = 0;
        this.translateDisapear = 0;
        /****/
        this.slipRowingX = 0;
        this.slipRowingY = 0;

        this.disapearVelocity   = 1000;
        this.disapearNumCanvas  = document.createElement('canvas');
        
        this.disapearNumContext = this.disapearNumCanvas.getContext('2d');
        this.disapearing = false;

        //disapear background color
        this.DISAPEAR_BACKGROUN_COLOR = '#c4c2c2';

        //number slice 
        this.allSlices =[[],[],[],[],[]];

        //remember number data 记录下滑的数据
        this.countTranslate = 0;
        this.arrayTranslate =[{},{},{},{},{}];

}
inheritPrototype(NumberDisper,Game);

NumberDisper.prototype.calcular=function(){
        this.slipRowingDistance = this.stepX/
                                 (1-this.velocity/this.disapearVelocity);
        this.slipRowingTime = this.slipRowingDistance/this.disapearVelocity;
};

NumberDisper.prototype.disapearCanvas=function(slipArr){
        var _this = this;
        this.calcular();
        this.disapearNumContext.clearRect(0,0,this.disapearNumCanvas.width,
                                          this.disapearNumCanvas.height);
        slipArr.forEach(function(num){
               if(_this.checkInScreen(num)){
                      _this.drawDisapearCanvas(num);
               }
        });
        this.drawGrid(this.disapearNumContext);
        
};

NumberDisper.prototype.drawDisapearCanvas=function(num){
        if(num>=this.row*this.rank){
               this.drawToDACanHide(num);
        }else{
               this.drawToDACanOffset(num);
        }
};

    //draw to offset screen canvas 
NumberDisper.prototype.drawToDACanHide=function(num){
       var numTop = 0,gridNum = 0,spreenNum,i,k,
           aboveHeight = this.translateOffset+this.row*this.stepX,
           hideHeight = this.row*this.stepX - aboveHeight;
       //get this row number
       numTop = parseInt((num-this.rank*this.row)/this.rank)*this.stepX - hideHeight;
       gridNum = Math.ceil(numTop/this.stepX);
       spreenNum = Math.ceil(this.slipRowingDistance/this.stepX);
      
       for( i = num-this.rank,k=0;k<gridNum;i -= this.rank,k++){
             this.slipRowing[k] = this.hideNum[i];
       }
       for(i=gridNum,k=0;k<spreenNum;k++,i++){
             this.slipRowing[i] = Math.round(this.getRandom(1,8));
       }
       //set arrayTranslate data
       this.arrayTranslate[this.countTranslate].high = this.slipRowing.length*this.stepX;
       this.arrayTranslate[this.countTranslate].translate = numTop;
       
       this.updateHideNum(this.slipRowing,num);
       //draw to offset screen canvas
       this.drawToDOffsetCan(num);           
};

NumberDisper.prototype.drawToDACanOffset=function(num){
       var numTop = 0,gridNum = 0,newNum,spreenNum,i,k,
           aboveHeight = this.translateOffset+this.row*this.stepX;
       //get this row number
       numTop = parseInt(num/this.rank)*this.stepX + aboveHeight;
       gridNum = Math.ceil(numTop/this.stepX);
       spreenNum = Math.ceil(this.slipRowingDistance/this.stepX);

       for( i = num-this.rank,k=0;i>0;i -= this.rank,k++){
             this.slipRowing[k] = this.offsetNum[i];
       }
       newNum = (2*this.row-1)*this.rank + num%5;
       for( i = newNum;k<gridNum;i -= this.rank,k++){
             this.slipRowing[k] = this.hideNum[i];
       }
       for(i=gridNum,k=0;k<spreenNum;k++,i++){
             this.slipRowing[i] = Math.round(this.getRandom(1,8));
       }
       //set arrayTranslate data
       this.arrayTranslate[this.countTranslate].high = this.slipRowing.length*this.stepX;
       this.arrayTranslate[this.countTranslate].translate = numTop;
       
       this.updateOffsetNum(this.slipRowing,num);
       //draw to offset screen canvas
       
       this.drawToDOffsetCan(num);
};

NumberDisper.prototype.drawToDOffsetCan=function(num){
       var i,k,count = this.slipRowing.length-1,
           numWidth  = num%5*this.stepX,
           height    = this.canvas.height,
           width     = this.canvas.width;

       this.arrayTranslate[this.countTranslate].x = numWidth;

       this.disapearNumContext.save();
       for(i=0;i<width;i+=this.stepX){
             if(numWidth===i){
                   for(k=0;count>=0;k+= this.stepX){
                           this.disapearNumContext.fillRect(i,k,this.stepX,this.stepX);
                           this.drawDisapearNumber(i,k,this.stepX,this.slipRowing[count]);
                           count--;
                   }
                   break;
             }
       }

       this.disapearNumContext.restore();
       this.countTranslate++;
};
NumberDisper.prototype.drawDisapearNumber=function(k,i,stepX,stort){
       var numColor = this.setNumberColor();
       this.disapearNumContext.save();
       this.disapearNumContext.fillStyle = numColor;
       this.disapearNumContext.fillText(stort,k+stepX/2,i+stepX/2);
       this.disapearNumContext.restore();
};

NumberDisper.prototype.updateHideNum = function(arr,num){
       for(var i=0;i<arr.length;i++){
              this.hideNum[num] = arr[i];
              num-=this.rank;
              if(num<0){
                      return ;
              }
       }
};

NumberDisper.prototype.updateOffsetNum = function(arr,num){
       var x = num%5;

       for(var i=0;i<arr.length;i++){
              this.offsetNum[num] = arr[i];
              num-=this.rank;
              if(num<0){
                     break;
              }
       }
       num = (2*this.row-1)*this.rank + x;
       for(;i<arr.length;i++){
              this.hideNum[num] = arr[i];
              num-=this.rank;
              if(num<0){
                      return ;
              }
       }
};

/****/
   //draw disapear number
NumberDisper.prototype.drawDisapearNum=function(num){
       if(num>=this.row*this.rank){
               this.dispearHide(num);
       }else{
               this.disapearOffset(num);
       }
};
/****/
NumberDisper.prototype.dispearHide=function(num){
       var aboveHeight = this.translateOffset+this.row*this.stepX,
           x = this.canvas.width - ((2*this.row*this.rank - num)+1)%5*
                                   this.stepX,
           y = aboveHeight - parseInt(((2*this.row*this.rank - num)+1)/5)*this.stepX;
       this.slipRowingX = x;
       this.slipRowingY = y+this.stepX;
       this.context.save();

       this.drawDispearNumberBack(x,y);
       this.context.restore();
};
/****/
NumberDisper.prototype.disapearOffset=function(num){
       var aboveHeight =this.translateOffset+this.row*this.stepX,
           x = num%5*this.stepX,
           y = aboveHeight + parseInt(num/5)*this.stepX;
       this.slipRowingX = x;
       this.slipRowingY = y+this.stepX;
       this.context.save();

       this.drawDispearNumberBack(x,y);
       this.context.restore();
};

NumberDisper.prototype.drawDispearNumberBack=function(x,y){
       this.context.save();
       this.context.fillStyle = this.DISAPEAR_BACKGROUN_COLOR;
       this.context.fillRect(x,y,this.stepX,this.stepX);
       this.context.restore();
};

NumberDisper.prototype.checkInScreen=function(num){
       var aboveHeight = this.translateOffset+this.row*this.stepX,
           belowHeight = this.canvas.height - aboveHeight,
           aboveRange  = 2*this.row*this.rank - Math.ceil(aboveHeight / this.stepX)*this.rank,
           belowRange  = Math.ceil(belowHeight / this.stepX)*this.rank;

       return (num>=aboveRange&&num<2*this.row*this.rank) ||
              (num<belowRange);

};

/****/
NumberDisper.prototype.numberDisapears=function(){   
       for(var i=0;i<this.rememberNum.length;i++){
               this.drawDisapearNum(this.rememberNum[i]);
       }
};

//分割被点击的数组
NumberDisper.prototype.sliceRememberNum=function(){
       this.allSlices =[[],[],[],[],[]];
       for(var i=0;i<this.rememberNum.length;i++){
               var num =   this.rememberNum[i];
               this.allSlices[num%this.rank].push(num);    
       }
       this.sortDisapearNum();
};

NumberDisper.prototype.sortDisapearNum = function(){
       var arrayH = [],arrayO = [],count=0,
           _this = this;
       function arrSort(a,b){
               return a - b;
       }
       this.allSlices.forEach(function(slices){
               slices.forEach(function(slice){
                       if(slice>=_this.row*_this.rank){
                               arrayH.push(slice);
                       }else{
                               arrayO.push(slice);
                       }
               });
               arrayH.sort(arrSort);
               arrayO.sort(arrSort);
               _this.allSlices[count] = arrayH.concat(arrayO);
               count++;
               arrayH = [];
               arrayO = [];
       });
};
//获取本次下滑的数据
NumberDisper.prototype.produceSlipArr = function(){
       var nowArray = [],num;
       for(var i=0;i<this.allSlices.length;i++){
              num = this.allSlices[i].shift();
              if(num!==undefined){
                      nowArray.push(num);
              }
       }

      return nowArray;
};

//初始化下滑数据

NumberDisper.prototype.slipInitial=function(){
       var slipArr;
       this.sliceRememberNum();
       slipArr = this.produceSlipArr();
       this.disapearCanvas(slipArr);

       this.disapearing = true;
};

NumberDisper.prototype.drawOffsetToScreen =function(translateDelta){
       var y;

       for(var i=0;i<this.countTranslate;i++){
              this.arrayTranslate[i].translate+=translateDelta;
              y = this.arrayTranslate[i].high - this.arrayTranslate[i].translate;
              this.context.drawImage(this.disapearNumCanvas,
                  this.arrayTranslate[i].x,y,this.stepX,
                  this.arrayTranslate[i].translate,this.arrayTranslate[i].x,0,this.stepX,
                  this.arrayTranslate[i].translate);
       }
          
};

NumberDisper.prototype.pixelsPerFrameDis=function(){
        return this.disapearVelocity/this.fps;
};

NumberDisper.prototype.scrollDisapear=function(){
       var slipArr;
           translateDelta = parseFloat(this.pixelsPerFrameDis().toFixed(2));

       this.translateDisapear += translateDelta;
       if(this.translateDisapear>=this.slipRowingDistance){
              slipArr = this.produceSlipArr();
              if(slipArr.length===0){
                     this.translateDisapear = 0;
                     this.countTranslate = 0;
                     this.arrayTranslate =[{},{},{},{},{}];
                     this.disapearing = false;
                     this.rememberNum = [];
              }else{ 
                     this.translateDisapear = 0;
                     this.countTranslate = 0;
                     this.arrayTranslate =[{},{},{},{},{}];
                     this.disapearCanvas(slipArr);
              }
       }else{
              //this.numberDisapears();
              this.drawOffsetToScreen(translateDelta);
       }  
};

NumberDisper.prototype.animation=function(time){
       var self = this;
       if(this.pause){
              setTimeout(function(){
                      self.animation.call(self,time);
              },this.PAUSE_TIMEOUT);
       }else{
              this.tick(time);
              if(this.disapearing){
                      this.scrollDisapear();
              }
              this.scrollBackground();
              window.requestAnimationFrame(function(time){
                      self.animation.call(self,time);
              });
       }
};

/**
 * ************************************************************
 * Boom 
 * @param {[type]} name     [description]
 * @param {[type]} canvasId [description]
 **************************************************************
 */
function Boom(name,canvasId){
       NumberDisper.call(this,name,canvasId);

       //boom
       //89
       this.bombCanvas = document.createElement('canvas');
       this.bombContext = this.bombCanvas.getContext('2d');
       this.translateBoom = 0;

       this.boom = false;
       this.boomVelocity = 2000;
       this.boomBackground = "rgb(159,159,159)";
       
       this.bombingProp = [];
       this.bombingLevel = 0;
       this.bombScorePerGrip = 49;

       //boom for vertical 
       this.boomNowTime = 0;
       this.boomLastTime = 0;
       this.boomAllTime = 0;
       //89
       this.boomStartTime = 0;
       this.bombVNum = [];
       this.bombVColor = [];

       this.bombDownloadHigh = 0;
       this.bombScore = 0;
       
       //89 
       this.bombImage = [];
       this.bombVImgWidth = 0;
       this.bombVImgHeight = 0;

       this.bombVImgTop = 0;
       //89
       this.changeBombImgTime = 0;
       this.bombX = 0;
       this.translateV = 0;
       this.bombCanvasHigh =0;
       this.bombStartShowNum = 0;
       this.bombLevel45 = {w:130,h:253,ex:200,del:500};
       this.bombLevel67 = {w:115,h:250,ex:200,del:500};
       
       //bomb horizontal
       //89
       this.bombVImgLeft = 0;
       this.bombHLoc = 0;
       this.bombY = 0;

       this.bombHImgWidth =0;
       this.bombHImgHeight = 0;
       this.translateHor = 0;
       
       this.boomHLT = 0;
       this.bombHEX = 0;
       this.bombHDel = 0;
       this.bombHVec = this.boomVelocity*this.canvas.width/(this.canvas.height+100);
       this.bombHor67 = {w:250,h:115,ex:100,del:400};
       this.bombHCan = document.createElement('canvas');
       this.bombHCtx = this.bombHCan.getContext('2d');
       this.bombHNA = [];
       this.bombHCol = [];
       this.bombHTSL = 0;
       this.bombHhigh = 0;
       this.bombHAllhigh = 0;
       this.bombHhighs = 0;
       this.bombHdBack = true;

       //boom 8 9 way
       this.bombL89 = {w:315,h:360,ex:200,In:5};
       this.bombL99 = {w:380,h:490,ex:500,In:4};
       this.bombImgNum = 0;
       this.bombImgNums = 0;
       this.bombCanLeft = 0;
       this.bombCanTop = 0;
       this.bomb89LeL = 0;
       this.bomb89LeR = 0;
       this.bomb89High = 0;
       this.triggerNum = 0;
       this.scores8 = 39;

       this.radius9 = 0;
       this.radiusHest9 = 0;
       this.traslateL9 = 0;
   
       //image loading 
       this.images = {};
       this.imageUrls = [];
       this.imagesLoaded = 0;
       this.imagesFailedToLoad = 0;
       this.imagesIndex = 0;

       //prop 
       this.propLocity = [];
       this.prop = false;
       this.propImgUrl = '../img/prop';
}

inheritPrototype(Boom,NumberDisper);
        
Boom.prototype.pixelsPerFrameBoom=function(velocity){
        return velocity/this.fps;
};

Boom.prototype.produceBigBombs = function(data_number){

        var bombLevel,bombData,rows;
        bombData = this.produceBomb();
        bombLevel = this.bombingLevel;

        this.triggerNum = data_number;
        
        this.produceBomb8(bombData,bombLevel);
};

Boom.prototype.produceBombs = function(data_number){
        var bombLevel,bombData;
        this.boomNowTime=0;
        bombData = this.produceBomb();
        bombLevel = this.bombingLevel;
        console.log(5);
        if(bombLevel<=5){
                this.bombScore = this.row*(this.bombScorePerGrip+
                             (bombLevel-4)*15)*data_number;
        }else{
                this.bombScore = (this.row+this.rank)*(this.bombScorePerGrip+
                             (bombLevel-4)*20)*data_number;
        }
        this.produceBomb45(bombData,bombLevel);
};

Boom.prototype.produceBomb = function(){
       var bombData = [],bombLevel=0,
           length = this.bombingProp[0].length;
              
       for(var k=0;k<this.bombingProp.length;k++){
               if(bombLevel<this.bombingProp[k][length-1]){
                      bombLevel = this.bombingProp[k][length-1];
                      bombData = this.bombingProp[k];
               }
       }
       this.delteProping(bombData[0]);
       this.bombingLevel = bombLevel;

       return bombData;
};

Boom.prototype.produceBomb45 =function(bombData,bombLevel){
        if(bombLevel<=5){
               this.initialBombingData(bombData,this.bombLevel45);
        }else{
               this.produceBomb67(bombData,bombLevel);
        } 
};

Boom.prototype.initialBombingData = function(bombData,dataArr){
        this.bombX = bombData[0]%this.rank*this.stepX;
        this.bombImage.push(bombData[2]);
        if(bombData.length>4){
               this.bombImage.push(bombData[3]);   
        }
        this.bombVImgWidth = dataArr.w;
        this.bombVImgHeight = dataArr.h;
        this.translateBoom = -this.bombVImgHeight;
        this.boomAllTime = (this.canvas.height+
                                 this.bombVImgHeight)/
                                 (this.boomVelocity/this.fps-
                                  this.velocity/this.fps);
        this.changeBombImgTime = dataArr.ex;
        this.bombStartShowNum = dataArr.del;
        this.bombCanvas.width = this.canvas.width;
        
        this.initialCanvas54();
};

Boom.prototype.initialCanvas54 = function(){
        var random;
            this.itlBaseCan(this.bombContext);
        
        for(i=0;i<this.bombCanvas.height;i+= this.stepX){
               this.bombContext.strokeRect(this.bombX,i,this.stepX,this.stepX);
               this.bombContext.fillRect(this.bombX,i,this.stepX,this.stepX);
               random = Math.round(this.getRandom(1,8));
               this.drawBoomNumber(this.bombX,i,this.stepX,random,this.bombContext,this.bombVColor);
               this.bombVNum.push(random);             
        }
        this.bombCanvasHigh = this.bombVNum.length*this.stepX;
        this.translateV = this.bombCanvasHigh;  
};

Boom.prototype.drawBoomNumber=function(k,i,stepX,stort,context,colorArr){
       var numColor = this.setNumberColor();
       colorArr.push(numColor);
       context.save();
       context.fillStyle = numColor;
       context.fillText(stort,k+stepX/2,i+stepX/2);
       context.restore();
};

Boom.prototype.drawBoomNumbers =function(k,i,stepX,stort,color,context){
       context.save();
       context.fillStyle = color;
       context.fillText(stort,k+stepX/2,i+stepX/2);
       context.restore();
};

Boom.prototype.itlBaseCan = function(context){
       var num = Math.ceil(this.canvas.height/this.stepX)*this.stepX+2*this.stepX;
       context.canvas.height =num;
       context.strokeStyle = this.context.strokeStyle;
       context.fillStyle = this.context.fillStyle;
       context.font = this.context.font;
       context.textAlign = this.context.textAlign;
       context.textBaseline = this.context.textBaseline;
};

Boom.prototype.initialCanvas76 = function(){
       var random,numColor,count=0,i,k,nums;
       this.bombHCan.width = this.canvas.width;
       this.itlBaseCan(this.bombHCtx);

       for(i=0;i<this.rank;i++){
            random = Math.round(this.getRandom(1,8));
            numColor = this.setNumberColor();
            this.bombHNA.push(random);
            this.bombHCol.push(numColor);
       }
       
       nums = this.getAboveNum();
       for(i=0;count<this.bombHNA.length;i+= this.stepX){
              for(k=0;k<=this.canvas.width;k+=this.stepX){
                    this.bombHCtx.strokeRect(k,i,this.stepX,this.stepX);
                    this.bombHCtx.fillRect(k,i,this.stepX,this.stepX);
                    this.drawBoomNumbers(k,i,this.stepX,this.bombHNA[count],
                                       this.bombHCol[count],this.bombHCtx);
                    count++;
              }
       }
       
       this.bombHAllhigh = this.bombHNA.length*this.stepX;
       this.bombHTSL = -((nums.ys+1)*this.stepX - this.bombY);
       this.bombHhighs = this.stepX/(1-this.velocity/this.boomVelocity);
       this.bombHCtx.clearRect(nums.xs*this.stepX,0,this.stepX,this.bombHAllhigh);
};

Boom.prototype.getAboveNum = function(){
       var i,k,sort,lows,

           ys = Math.ceil(this.bombY/this.stepX),
           xs1 = this.bombHLoc%this.rank;

       if(this.bombHLoc>this.row*this.rank){
             sort = this.bombHLoc - xs1 - ys*this.rank;
             for(i=sort;i<this.bombHLoc - xs1;i++){
                    this.bombHNA.push(this.hideNum[i]);
                    this.bombHCol.push(this.hideColor[i]);
             }
       }else{
             lows = parseInt(this.bombHLoc/this.rank);
             sort = 2*this.row*this.rank - (ys-lows)*this.rank;
             for(i=sort;i<2*this.row*this.rank;i++){
                    this.bombHNA.push(this.hideNum[i]);
                    this.bombHCol.push(this.hideColor[i]);
             }
             for(i=0;i<lows*this.rank;i++){
                    this.bombHNA.push(this.offsetNum[i]);
                    this.bombHCol.push(this.offsetColor[i]);
             }
       }

       return {
             ys:ys,
             xs:xs1
       };
}; 

Boom.prototype.produceBomb67 =function(bombData,bombLevel){
      this.initialBombingData(bombData,this.bombLevel67);
      this.initialBHor(bombData,this.bombHor67);
};

Boom.prototype.initialBHor = function(bombData,dataOb){
       
       this.boomHLT = 0;
       this.bombHNA = [];
       this.bombHCol = [];
       this.bombHhigh = 0;
       this.bombHdBack = true;

       this.bombHLoc = bombData[0];
       this.bombVImgLeft = 0;
       this.bombHImgWidth =dataOb.w;
       this.bombHImgHeight = dataOb.h;
       this.bombHEX = dataOb.ex;
       this.bombHDel = dataOb.del;
       this.translateHor = -this.bombHImgWidth; 
       this.initialBHorY();
       this.initialCanvas76();
       this.deltePropingX(this.bombHLoc);
};

Boom.prototype.initialBHorY = function(){
       var  lowgribs=0;
            aboveHigh = this.translateOffset+this.row*this.stepX;

       if(this.bombHLoc>this.row*this.rank){
            lowgribs = this.row - parseInt((this.bombHLoc-this.row*this.rank)/this.rank);
            this.bombY = aboveHigh - lowgribs*this.stepX;
       }else{
            lowgribs = parseInt(this.bombHLoc/this.rank);
            this.bombY = aboveHigh +lowgribs*this.stepX;
       }
};

Boom.prototype.produceBomb8 =function(bombData,bombLevel){
        if(bombLevel<=8){
              this.initialBL8(bombData,this.bombL89);
              this.initialCS8();
        }else{

             this.produceBomb9(bombData,bombLevel);
        } 
};

Boom.prototype.initialBL8 = function(bombData,L89data){
        this.boomStartTime     = 0;
        /*改动*/
        this.bombHLoc = bombData[0];
        this.bombVImgLeft      = 1340;
        this.bombImgNum        = 0;
        this.bombImgNums       = L89data.In;
        this.changeBombImgTime = L89data.ex;
        this.bombVImgWidth     = L89data.w;
        this.bombVImgHeight    = L89data.h;
        this.bomb89LeL = this.canvas.width/2;
        this.bomb89LeR = this.bomb89LeL;

        this.bombImage.push(bombData[2]);
        if(bombData.length>4){
               this.bombImage.push(bombData[3]); 
        }
        
        
        this.boomCanLeft = this.canvas.width/2-
                            this.bombVImgWidth/2;
        this.changeL8Top();
        this.cal8Score();
};

Boom.prototype.cal8Score = function(){
        var rows = Math.ceil(this.canvas.height-this.bombY);
        
        this.bombScore = rows*this.rank*this.scores8*(this.triggerNum-2);
};

Boom.prototype.initialCS8 = function(){
        this.bombCanvas.width = this.canvas.width;
        this.itlBaseCan(this.bombContext);
        
        this.bombVNum = [];
        this.bombVColor = [];

        var i,k,random,rows,sort,lows,nowIndex,ys,xs,count=0;
        
        rows = parseInt(this.bombCanvas.height/this.stepX);
        nowIndex = rows*this.rank-1;

        ys = Math.ceil(this.bombY/this.stepX);
        xs = this.bombHLoc%this.rank;
        
        if(this.bombHLoc>this.row*this.rank){
              sort = this.bombHLoc - xs - ys*this.rank;
              for(i=this.bombHLoc - xs-1;i>=sort;i--){
                     this.bombHNA.push(this.hideNum[i]);
                     this.bombHCol.push(this.hideColor[i]);
              }
        }else{
              lows = parseInt(this.bombHLoc/this.rank);
              sort = 2*this.row*this.rank - (ys-lows)*this.rank;
              for(i=lows*this.rank-1;i>=0;i--){
                     this.bombHNA.push(this.offsetNum[i]);
                     this.bombHCol.push(this.offsetColor[i]);
              }
              for(i=2*this.row*this.rank-1;i>=sort;i--){
                     this.bombHNA.push(this.hideNum[i]);
                     this.bombHCol.push(this.hideColor[i]);
              }
        }

        for(i=(rows-1)*this.stepX;count<this.bombHNA.length;i-=this.stepX){
               for(k=(this.rank-1)*this.stepX;k>=0;k-=this.stepX){
                     this.bombContext.strokeRect(k,i,this.stepX,this.stepX);
                     this.bombContext.fillRect(k,i,this.stepX,this.stepX);
                     this.drawBoomNumbers(k,i,this.stepX,this.bombHNA[count],
                                        this.bombHCol[count],this.bombContext);
                     count++;
               }
        }

        for(;i>=0;i-=this.stepX){
               for(k=(this.rank-1)*this.stepX;k>=0;k-=this.stepX){
                     this.bombContext.strokeRect(k,i,this.stepX,this.stepX);
                     this.bombContext.fillRect(k,i,this.stepX,this.stepX);
                     random = Math.round(this.getRandom(1,8));
                     this.drawBoomNumber(k,i,this.stepX,random,
                                      this.bombContext,this.bombHCol);
                     this.bombHNA.push(random);
               }
        }

        this.translateBoom = this.bombY - this.bombCanvas.height;
        this.bomb89High = this.bombCanvas.height;

};

Boom.prototype.changeL8Top = function(){
        this.initialBHorY();
        this.boomCanTop = (this.canvas.height -
                          this.bombY)/2-
                        this.bombVImgWidth/2;
};

Boom.prototype.scrollBoom8 = function(time,translateDelta){
        if(this.boomStartTime===0){
             this.boomStartTime = time;
        }
        if(time - this.boomStartTime>this.changeBombImgTime){
               this.boomStartTime = time;
               this.bombVImgLeft -=  this.bombVImgWidth;
               this.bombImgNum++;  
        }
         
        this.changeL8Top();
        if(this.bombImgNum<this.bombImgNums){
               this.changeL8Top();
               this.context.drawImage(this.bombImage[0],
               this.bombVImgLeft,0,this.bombVImgWidth,
               this.bombVImgHeight,
               0,this.boomCanTop,
               this.canvas.width,this.canvas.height-this.boomCanTop);
        }

        this.bomb89LeL -= translateDelta;
        this.bomb89LeR += translateDelta;
        this.context.save();
        this.context.fillStyle = this.boomBackground;
        this.context.fillRect(this.bomb89LeL,this.bombY,
                   this.canvas.width/2-this.bomb89LeL,this.canvas.height-this.bombY);
        this.context.fillRect(this.canvas.width/2,this.bombY,
                   this.bomb89LeR - this.canvas.width/2,this.canvas.height-this.bombY);
        this.context.restore();

        if(this.bomb89LeL<0){
               this.drawCanvas89();
        }
};

Boom.prototype.drawCanvas89 = function(){
        if(this.bomb89High+this.translateBoom<this.canvas.height){
              this.context.drawImage(this.bombCanvas,
              0,-this.translateBoom,this.canvas.width,
              this.bomb89High+this.translateBoom,
              0,0,this.canvas.width,
              this.bomb89High+this.translateBoom);

        }else{
              
              this.prop = false;
              this.bombImage = [];
               
              //数据恢复
              this.restore8Num();
              //删除其中的道具，并修改上面道具的位置 
              this.delAndUpProp();
              this.boom = false;
        }       
};

Boom.prototype.delAndUpProp = function(){
        var loc,i,ys,xs,YS;
        if(this.bombHLoc<this.row*this.rank){
                loc =this.bombHLoc - this.bombHLoc%this.rank;
                for(i=0;i<this.propLocity.length;i++){
                      if(this.propLocity[i][0]>=loc&&this.propLocity[i][0]<this.row*this.rank){
                            this.propLocity.splice(i,1);
                            i--;
                      }
                }
                //更新prop位置
                YS = parseInt(this.bombHLoc/this.rank);
                for(i=0;i<this.propLocity.length;i++){
                       loc = this.propLocity[i][0];
                       xs  = loc%this.rank;
                       if(loc<=this.rank*this.raw){
                             ys = parseInt(loc/this.rank);
                             ys = YS-ys;
                             this.propLocity[i][0] = 2*this.rank*this.row-
                                          ys*rank+xs;
                       }else{
                             ys = (2*row - parseInt(loc/this.rank) +YS);
                             this.propLocity[i][0] = 2*this.rank*this.row-
                                          ys*rank+xs;
                       }
                }
        }else{
               loc =this.bombHLoc - this.bombHLoc%this.rank;
               for(i=0;i<this.propLocity.length;i++){
                     if(this.propLocity[i][0]>=loc||this.propLocity[i][0]<this.row*this.rank){
                           this.propLocity.splice(i,1);
                           i--;
                     }
               }
        }
        
        this.translateBoom = this.bombY - this.bombCanvas.height;
        this.bomb89High = this.bombCanvas.height;
};

Boom.prototype.restore8Num = function(){
        var count = 2*this.row*this.rank-1;
        for(var i=0;i<this.bombHNA.length&&count>=this.row*this.rank;i++){
             this.hideNum[count] = this.bombHNA[i];
             this.hideColor[count] = this.bombHCol[i];
             count--;
        }
        this.translateOffset = this.canvas.height - this.row*this.stepX;
};

Boom.prototype.produceBomb9 =function(bombData,bombLevel){
        this.initialBL9(bombData,this.bombL99);
        this.initialCan9();
};

Boom.prototype.initialCan9 = function(){
        this.bombCanvas.width = this.canvas.width;
        this.itlBaseCan(this.bombContext);
        
        this.bombVNum = [];
        this.bombVColor = [];

        var i,k,radom,count = 0,
            high = this.row*this.stepX,
            width = this.rank*this.stepX;

        for(i=0;i<high;i+=this.stepX){
               for(k=0;k<width;k+=this.stepX){
                     this.bombContext.strokeRect(k,i,this.stepX,this.stepX);
                     this.bombContext.fillRect(k,i,this.stepX,this.stepX);
                     random = Math.round(this.getRandom(1,8));
                     this.drawBoomNumber(k,i,this.stepX,random,
                                      this.bombContext,this.bombHCol);
                     this.bombHNA.push(random);
               }
        }
        this.traslateL9 = -high;
        this.bomb89High = high;
};

Boom.prototype.initialBL9 = function(bombData,dataArr){

        this.bombVImgLeft      = 0;
        this.boomStartTime     = 0;
        this.bombImgNum        = 0;
        this.bombImgNums       = dataArr.In;
        this.changeBombImgTime = dataArr.ex;
        this.bombVImgWidth = dataArr.w;
        this.bombVImgHeight = dataArr.h;
        this.radius9 = 0;
        this.radiusHest9 = Math.sqrt(Math.pow(this.canvas.width/2,2)+
                           Math.pow(this.canvas.height/2,2));
        this.bombImage.push(bombData[2]);
        if(bombData.length>4){
               this.bombImage.push(bombData[3]); 
        }

        
        this.calLevel9Score();
};

Boom.prototype.calLevel9Score = function(){
       this.bombScore = this.rank*this.row*this.scores8*(this.triggerNum-2);
};

Boom.prototype.scrollBoom9 = function(time,translateDelta){

        if(this.boomStartTime ===0){
                this.boomStartTime = time;
        }
        if(time - this.boomStartTime>this.changeBombImgTime){
                this.boomStartTime = time;
                this.bombImgNum++;
                this.bombVImgLeft += this.bombVImgWidth;
        }
        if(this.bombImgNum < this.bombImgNums){
                this.context.drawImage(this.bombImage[0],
                 this.bombVImgLeft,0,this.bombVImgWidth,this.bombVImgHeight,
                 0,0,this.canvas.width,this.canvas.height);
        }else{
                this.boom = false;
        }

        this.radius9 += translateDelta;
        
                this.context.save();
                this.context.beginPath();
                this.context.fillStyle = this.boomBackground;
                this.context.arc(this.canvas.width/2,this.canvas.height/2,
                    this.radius9,0,2*Math.PI);
                this.context.fill();
                this.context.restore();

        if(this.radius9>=this.radiusHest9){        
                this.drawCanvas9(translateDelta);
        }


};

Boom.prototype.drawCanvas9 = function(translateDelta){
        this.traslateL9 += translateDelta;
        if(this.bomb89High+this.traslateL9<this.canvas.height){
              this.context.drawImage(this.bombCanvas,
              0,-this.traslateL9,this.canvas.width,
              this.bomb89High+this.traslateL9,
              0,0,this.canvas.width,
              this.bomb89High+this.traslateL9);
        }else{
              
              this.prop = false;
              this.bombImage = [];
               
              //数据恢复
              this.restore9Num();
              //删除其中的道具，并修改上面道具的位置 
              this.propLocity = [];
              this.boom = false;
        }  
};

Boom.prototype.restore9Num = function(){
       var count =this.rank*this.row,
           all = 2*count;
       for(var i=0;i<this.bombHNA.length&&count<all;i++){
             this.hideNum[count] = this.bombHNA[i];
             this.hideColor[count] = this.bombHCol[i];
             count++;
       }
       this.translateOffset = this.canvas.height - this.row*this.stepX;
};

Boom.prototype.scrollBoom=function(time){
        var translateDelta = parseFloat(this.pixelsPerFrameBoom(this.boomVelocity).toFixed(2));
        this.translateBoom += translateDelta;
        if(this.bombingLevel<=5){
               this.scrollBoom45(time,translateDelta);
        }else if(this.bombingLevel<=7){
               this.scrollBoom45(time,translateDelta);
        }else if(this.bombingLevel<=8){
               this.scrollBoom8(time,translateDelta);
        }else{
               this.scrollBoom9(time,translateDelta);
        }
};

Boom.prototype.scrollBoom45 = function(time,translateDelta){
        
        if(this.boomNowTime ===0){
               
               this.boomLastTime = this.boomStartTime = time;
        }else if(this.boomNowTime - this.boomLastTime>this.changeBombImgTime){
               this.boomLastTime = this.boomNowTime;
               this.bombVImgTop +=this.bombVImgHeight;
        }
        this.context.drawImage(
                 this.bombImage[0],
                 0,this.bombVImgTop,this.bombVImgWidth,
                 this.bombVImgHeight,
                 this.bombX,this.translateBoom,
                 this.stepX,this.bombVImgHeight);
        if(this.bombImage[1]!==undefined){
                 this.drawHORImg(this.bombImage[1],time,translateDelta);
        }
          
        this.context.save();
        this.context.fillStyle = this.boomBackground;
        this.context.fillRect(this.bombX,0,this.stepX,this.translateBoom);
        this.context.restore();
        if(time - this.boomStartTime>this.bombStartShowNum){
              this.drawCanvas54(translateDelta);
        }

        this.boomNowTime = time;
};

Boom.prototype.drawHORImg =function(image,time,translateDelta){
      var delta =  parseFloat(this.pixelsPerFrameBoom(this.bombHVec).toFixed(2));

      this.initialBHorY();
      if(this.boomHLT===0){
             this.boomHLT = time;
      }else if(this.boomNowTime-this.boomHLT>=this.bombHEX){
             this.boomHLT = this.boomNowTime;
             this.bombVImgLeft += this.bombHImgWidth;
      }
   
      this.translateHor += delta;
      this.context.drawImage(
               image,
               this.bombVImgLeft,0,this.bombHImgWidth,
               this.bombHImgHeight,
               this.translateHor,this.bombY,
               this.bombHImgWidth,this.stepX);
      if(this.bombHdBack){
              this.context.save();
              this.context.fillStyle = this.boomBackground;
              this.context.fillRect(0,this.bombY,this.translateHor,this.stepX);
              this.context.restore();
      }

      if(time - this.boomStartTime>this.bombHDel){
            this.drawCanvas76(translateDelta);
      }
};

Boom.prototype.drawCanvas54 = function(translateDelta){
        var aboveHight = this.row*this.stepX+this.translateOffset,
            belowHigh  = Math.ceil((this.canvas.height - aboveHight)/
                         this.stepX)*this.stepX,
            bombinghigh;
            this.bombDownloadHigh += translateDelta;
            bombinghigh = this.bombDownloadHigh-aboveHight;
            this.translateV -= translateDelta;
        if(bombinghigh>=belowHigh){
                this.endDrawCanvas54(bombinghigh);               
        }else{
                this.context.drawImage(this.bombCanvas,
                this.bombX,this.translateV,this.stepX,
                this.bombCanvasHigh-this.translateV,
                this.bombX,0,this.stepX,
                this.bombCanvasHigh-this.translateV);
        }
};

Boom.prototype.drawCanvas76 = function(translateDelta){
        this.bombHTSL += translateDelta/2;
        this.bombHhigh += translateDelta/2;
        if(this.bombHhigh>this.bombHhighs){
               //更新screen数值
               if(this.bombHdBack){
                     this.updateCanvas76();
               }
               this.bombHdBack = false;
        }else{
              this.context.drawImage(this.bombHCan,
                0,0,this.canvas.width,this.bombHAllhigh,
                0,this.bombHTSL,this.canvas.width,
                this.bombHAllhigh);
        }
};

Boom.prototype.updateCanvas76 =function(){
        var i,
            up= Math.ceil(this.bombHLoc/this.rank)*this.rank-1,
            length = this.bombHNA.length,
            row = this.bombHLoc%this.rank,
            all = this.row*this.rank;

        if(this.bombHLoc>this.row*this.rank){
              for(i=length-1;i>=0;i--){
                    if(up%this.rank!==row){
                          this.hideNum[up] = this.bombHNA[i];
                          this.hideColor[up] = this.bombHCol[i];
                    }
                    up--;
              }
        }else{
              for(i=length-1;up>=0;i--){
                    if(up%this.rank!==row){
                          this.offsetNum[up] = this.bombHNA[i];
                          this.offsetColor[up] = this.bombHCol[i];
                    }
                    up--;
              }
              for(;i>=0;i--){
                    if(all%this.rank!==row){
                          this.hideNum[all] = this.bombHNA[i];
                          this.hideColor[all] = this.bombHCol[i];
                    }
                    all--;
              }
        }
       
};

Boom.prototype.endDrawCanvas54 =function(bombinghigh){
        this.boomLastTime = 0;
        this.boomStartTime = 0;
        this.bombVImgTop = 0;
        this.boom = false;
        this.bombDownloadHigh = 0;
        this.prop = false;
        this.bombImage = [];
        
        //将数字赋值到screen
        this.numberReduction(bombinghigh);
};

Boom.prototype.numberReduction = function(bombinghigh){
        var i,
            belowNums = Math.round(bombinghigh/this.stepX),
            x = Math.round(this.bombX/this.stepX),
            allNums = this.bombVNum.length,
            low = allNums -belowNums,
            above = 2*(this.row-1)*this.rank +x;
        
        for(i=0;i<belowNums;i++){
               this.offsetNum[x] = this.bombVNum[low];
               this.offsetColor[x] = this.bombVColor[low];
               low++;
        }

        for(i=allNums -belowNums-1;i>=0;i--){
              this.hideNum[above] = this.bombVNum[i];
              this.hideColor[above]  = this.bombVColor[i];
              above -= this.rank;
        }
        this.bombVNum = [];
        this.bombVColor = [];
};

Boom.prototype.animation=function(time){

        var self = this;
        if(this.pause){
               setTimeout(function(){
                        self.animation.call(self,time);
               },this.PAUSE_TIMEOUT);
        }else{
               this.tick(time);
               this.scrollBackground();
               if(this.boom){
                      this.scrollBoom(time);
               }
               if(this.disapearing&&!this.boom){
                      this.scrollDisapear();
               }
               window.requestAnimationFrame(function(time){
                        self.animation.call(self,time);
               });
        }
};

 //important  .................................................      
Boom.prototype.controlWitchBoom=function(data_number){
       this.checkPropIsInPath();
        //if(data_number<=3){
        //         this.executeBombOrNo(data_number);
        //}else{ 
                 // this.controlWitchBoom4(data_number);
       // }
       this.controlWitchBoom4(9);
       
};

Boom.prototype.executeBombOrNo = function(){
         if(this.prop){
                if(data_number === 3){
                       this.produceBombs(data_number);
                }else{
                       this.delteProping();
                }
         }
};

Boom.prototype.controlWitchBoom4=function(data_number){
        if(data_number<=4){
               this.producePropOrBomb(data_number);
        }else{
               this.controlWitchBoom5(data_number);
        }
};

Boom.prototype.controlWitchBoom5=function(data_number){
        if(data_number<=5){
               this.producePropOrBomb(data_number);
        }else{
               this.controlWitchBoom6(data_number);
        }
};

Boom.prototype.controlWitchBoom6=function(data_number){
        if(data_number<=6){
               this.producePropOrBomb(data_number);
        }else{
               this.controlWitchBoom7(data_number);
        }
};

Boom.prototype.controlWitchBoom7=function(data_number){
        if(data_number<=7){
               this.producePropOrBomb(data_number);
        }else{
               this.controlWitchBoom8(data_number);
        }
};

Boom.prototype.controlWitchBoom8=function(data_number){
        if(data_number<=8){
               this.producePropOrBomb(data_number);
        }else{
               this.controlWitchBoom9(data_number);
        }
};

Boom.prototype.controlWitchBoom9=function(data_number){
        this.producePropOrBomb(data_number);
};

Boom.prototype.checkPropIsInPath=function(){
       for(var i=0;i<this.rememberNum.length;i++){
              for(var k=0;k<this.propLocity.length;k++){
                     if(this.propLocity[k][0] === this.rememberNum[i]){
                            this.prop = true;
                            this.bombingProp.push(this.propLocity[k]);
                     }
              }
       }
};

Boom.prototype.producePropOrBomb = function(data_number){
       if(!this.prop){
              this.produceProp(data_number);
       }else{
              this.boom = true; 
              if(data_number<8){
                      //this.produceBigBombs(data_number);
                      this.produceBombs(data_number);
              }else{
                     this.produceBigBombs(data_number);
              }     
       }
};

Boom.prototype.produceProp = function(data_number){
       var propArr = [],imgString3,
           imgString = this.propImgUrl+data_number+'1.png',
           imgString2 = this.propImgUrl +data_number+'2.png',
           aboveHigh = this.translateOffset+this.row*this.stepX,
           aboveRow = Math.ceil(aboveHigh/this.stepX),
           propX = Math.round(this.getRandom(1,4));
       
       propArr.push(2*this.row*this.rank - aboveRow*this.rank-propX); 
       propArr.push(this.images[imgString]);
       propArr.push(this.images[imgString2]);

       if(data_number===6||data_number===7){
             imgString3 = this.propImgUrl +data_number+'3.png';
             propArr.push(this.images[imgString3]);
       }
       propArr.push(data_number);
       this.propLocity.push(propArr);
};

Boom.prototype.deltePropBGImg = function(){
       var propLoc,high,
           aboveHigh = this.translateOffset+this.row*this.stepX;
       for(var i=0;i<this.propLocity.length;i++){
               propLoc = this.propLocity[i][0];
               if(propLoc>=this.row*this.rank){
                      high = (this.row - 
                             parseInt((propLoc-this.row*this.rank)/this.rank))*this.stepX;
                      if(aboveHigh - high>=this.canvas.height){
                             this.propLocity.splice(i,1);
                             i--;                      
                      }
               }else{
                      high = parseInt(propLoc/this.rank)*this.stepX + aboveHigh;
                      if(high>=this.canvas.height){
                             this.propLocity.splice(i,1);
                             i--;                      
                      }
               }
       }
};


Boom.prototype.drawPropBGImg = function(w,h,count){
       var i;
       for( i=0;i<this.propLocity.length;i++){
              if(this.propLocity[i][0] === count){
                      this.context.drawImage(
                      this.propLocity[i][1],w,h,
                      this.stepX,this.stepX);
              }
       }
};

Boom.prototype.extrangeProp = function(){
       var i;
       for( i=0;i<this.propLocity.length;i++){
              if(this.propLocity[i][0]>=this.row*this.rank){
                    this.propLocity[i][0] -= this.row*this.rank;
              }
       }
       for( i=0;i<this.rememberNum.length;i++){
              if(this.rememberNum[i]>=this.row*this.rank){
                    this.rememberNum[i] -= this.row*this.rank;
              }
       }
};

Boom.prototype.drawDisapearNums = function(w,h,count){
      for(var i=0;i<this.rememberNum.length;i++){
            if(count === this.rememberNum[i]){
                   this.drawDispearNumberBack(w,h);
            }
      }
};

Boom.prototype.drawNums=function(array,count,colorArr){
        var i,k,
            height = this.canvas.height,
            width = this.canvas.width;
       this.deltePropBGImg();
       for(i=0;i<height;i+= this.stepX){
               for(k=0;k<width;k+=this.stepX){
                      this.context.fillRect(k,i,this.stepX,this.stepX);
                      this.drawPropBGImg(k,i,count);
                      this.drawNumbers(k,i,this.stepX,array[count],colorArr[count]);
                      if(this.disapearing){
                             this.drawDisapearNums(k,i,count);
                      }
                      count++;
               }
            
       }
       this.drawGrid(this.context);
};

Boom.prototype.exchangeNum=function(){
        var i,k,countO = 0,
            count=this.row * this.rank,
            height = this.canvas.height,
            width = this.canvas.width;
        this.clearScreen();

        this.deltePropBGImg();
        this.extrangeProp();

        for(i=0;i<height;i+= this.stepX){
               for(k=0;k<width;k+=this.stepX){
                      this.context.fillRect(k,i,this.stepX,this.stepX);
                      this.drawPropBGImg(k,i,count);
                      this.drawNumbers(k,i,this.stepX,this.hideNum[count]);
                      this.offsetNum[countO] = this.hideNum[count];
                      if(this.disapearing){
                             this.drawDisapearNums(k,i,count);
                       }
                      count ++;
                      countO++;
             }
        }
        this.drawGrid(this.context);
};

Boom.prototype.delteProping = function(delRow){
     var row =-1;
     if(delRow!==undefined){
           row = delRow%this.rank;
     }
     for(var i=0;i<this.propLocity.length;i++){
            if(this.propLocity[i][0]%this.rank===row){
                  this.propLocity.splice(i,1);
                  i--;
                  continue;
            }
            for(var k=0;k<this.bombingProp.length;k++){
                  if(this.bombingProp[k][0] === this.propLocity[i][0]){
                         this.propLocity.splice(i,1);
                         i--;
                  }
            }
            
     }
     this.bombingProp = [];
};

Boom.prototype.deltePropingX = function(delRow){
     var row = parseInt(delRow/this.rank);
     for(var i=0;i<this.propLocity.length;i++){
            if(parseInt(this.propLocity[i][0]/this.rank)===row){
                  this.propLocity.splice(i,1);
                  i--;
            }  
     }
};


//////////////////////////////////////////////////////////////
//image loading  .......................................... //
//////////////////////////////////////////////////////////////
Boom.prototype.getImage=function(imageUrl){
       return this.images[imageUrl];
};

Boom.prototype.imageLoadedCallback=function(e){
       this.imagesLoaded++;
};

Boom.prototype.imageLoadErrorCallback=function(e){
       this.imagesFailedToLoad++;
};

Boom.prototype.loadImage=function(imageUrl){
        var image = new Image(),
            self = this;
        image.src = imageUrl;

        image.addEventListener('load', function(e){
              self.imageLoadedCallback(e);
        });
        image.addEventListener('error', function(e){
              self.imageLoadErrorCallback(e);
        });

        this.images[imageUrl] = image;
};

Boom.prototype.loadImages=function(){
        if(this.imagesIndex<this.imageUrls.length){
              this.loadImage(this.imageUrls[this.imagesIndex]);
              this.imagesIndex++;
        }

        return (this.imagesLoaded+this.imagesFailedToLoad)/
               this.imageUrls.length*100;
};

Boom.prototype.queueImage=function(imageUrl){
        this.imageUrls.push(imageUrl);
};


