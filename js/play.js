var boom = new Boom('Plus','mainPage'),
    context = boom.context,
    gameOver = false,

    //score 
    scoreShow = document.getElementById('Scores'),
    highestScores = document.getElementById('highestScore'),
    gameOverPage = document.getElementById('gameOver'),
    playAgainButton = document.getElementById('playAgainButton'),
    nowScores = document.getElementById('nowScores'),
    score = 0,
    highestScore = 0,

    //time
    residueTime = document.getElementById('time'),
    
    //number 
    lastNumber = 0,
    nowNumber = 0,
    nowTime = 0,
    lastTime = 0,
    fast_interval = 201,
    slow_interval = 401,
    data_number = 0,
    normalScores = [10,30,50,100,250,500,800,1000,3000],
    highScores = [10,50,100,200,500,1000,1500,3000,5000],

    //game
    velocity = 50,
    gameTime = 60,

    // progressbar
    loadImage = new Image(),

    loadButton = document.getElementById('loadButton'),
    progressbar = document.getElementById('progressbar');
    

//Function  .......................................................

function windowToCanvas(x,y){
       var bbox = context.canvas.getBoundingClientRect();
       return {
              x: x - bbox.left*(context.canvas.width/bbox.width),
              y: y - bbox.top*(context.canvas.height/bbox.height)
       };
}

function initinalGameData(){

       boom.velocity = velocity;
       boom.gameTime = gameTime;
       boom.elementTime = residueTime;

       context.strokeStyle  = '#d5d2d8';
       context.fillStyle = 'rgba(0,0,0,0.3)';
       boom.disapearNumContext.strokeStyle = context.strokeStyle;
       boom.disapearNumContext.fillStyle = context.fillStyle;

       
}

function initialPlayData(){
	     //score
       scoreShow.innerHTML = score;
}

function gameOverFunc(){
	   gameOver = true;
     boom.bombScore = 0;
     scoreIndex = 0;

     gameOverPage.style.display = 'block';
	   boom.setHeightScore(score);
     highestScore = boom.getHightScore();
     highestScores.innerHTML = highestScore;
     nowScores.innerHTML = score;
     score = 0;
     boom.rememberNum = [];
     boom.propLocity = [];
     initinalGameData();
     initialPlayData();
     boom.start();
}

function timeFunc(){
     if(nowTime - lastTime<fast_interval){
            calculateMoreScore();
     }else if(nowTime - lastTime<slow_interval){
            calculateScore();
     }
     lastTime = nowTime;
}

function controlTime(){
     setTimeout(function(){
           if((+new Date()) - lastTime>slow_interval){
                 startAgain();
           }else{
                 controlTime();
           }
     },16);
}

function calculateScore(){
     score += normalScores[data_number];
     scoreShow.innerHTML = score;
     data_number ++;
}

function calculateMoreScore(){
     score += highScores[data_number];

     scoreShow.innerHTML = score;
     data_number ++;
}

function calculateBoomScore(){
     score += boom.bombScore;
     scoreShow.innerHTML = score;
     boom.bombScore =0;
}

function startAgain(){
     //makeTools();
     boom.controlWitchBoom(data_number);
     calculateBoomScore();
     boom.slipInitial();
     lastNumber = nowNumber = 0;
     lastTime = nowTime = 0;
     data_number = 0; 
}

function makeTools(){
     boom.controlWitchBoom(data_number);
}

//Events  ..........................................................

context.canvas.onclick = function(e){
	    e.preventDefault();
      if(!boom.disapearing){
             var location = windowToCanvas(e.clientX,e.clientY);
             nowNumber = boom.getClickNum(location.x,location.y);
             if(lastNumber===0){
                   lastNumber=nowNumber;
                   lastTime = nowTime = +new Date();
                   calculateScore();
                   controlTime();
             }else{
                   if(nowNumber -lastNumber !==1){
                         lastTime = 0;
                   }else{
                         lastNumber = nowNumber;
                         nowTime = +new Date();
                         timeFunc();
                   }
             }   
      }
};

playAgainButton.onclick = function(){
      gameOverPage.style.display = 'none';
      boom.gameTime = gameTime;
      boom.pause = false;
};

window.onblur = function(){
	   if(!boom.pause){
	   	       boom.togglePause();
	   }
};

window.onfocus = function(){
	   if(boom.pause){
	           boom.togglePause();
	   }
};

//Initial ..........................................................

context.canvas.width = document.documentElement.clientWidth;
context.canvas.height = document.documentElement.clientHeight - 200;
boom.disapearNumCanvas.width = context.canvas.width;
boom.disapearNumCanvas.height = context.canvas.height;

context.font ="500 30px Helvetica";
context.textAlign = 'center';
context.textBaseline = 'middle';

boom.disapearNumContext.font = context.font;
boom.disapearNumContext.textAlign = context.textAlign;
boom.disapearNumContext.textBaseline = context.textBaseline;

//load  .............................................................

loadButton.onclick = function(e){
    var interval,
        percentCompleter=0,progressBar;
     
    e.preventDefault();
    loadButton.style.display = 'none';
    progressbar.style.display = 'block';
    progressBar= new COREHTML5.Progressbar('#0611f7','#7509c1',
    progressbar.clientWidth,progressbar.clientHeight);
    progressBar.appendTo(progressbar);


    boom.queueImage('../img/prop41.png');
    boom.queueImage('../img/prop42.png');
    boom.queueImage('../img/prop51.png');
    boom.queueImage('../img/prop52.png');
    boom.queueImage('../img/prop61.png');
    boom.queueImage('../img/prop62.png');
    boom.queueImage('../img/prop63.png');
    boom.queueImage('../img/prop71.png');
    boom.queueImage('../img/prop72.png');
    boom.queueImage('../img/prop73.png');
    boom.queueImage('../img/prop81.png');
    boom.queueImage('../img/prop82.png');
    boom.queueImage('../img/prop91.png');
    boom.queueImage('../img/prop92.png');

    interval = setInterval(function(){
            percentCompleter = boom.loadImages();
            if(percentCompleter===100){
                  clearInterval(interval);
                  progressbar.style.display = 'none';

                  setTimeout(function(){
                          document.getElementById('loadPage').style.display = 'none';
                          initinalGameData();
                          initialPlayData();
                          boom.start();
                  },400);
            }
            progressBar.erase();
        progressBar.draw(percentCompleter/100);
    },16);
               
};



