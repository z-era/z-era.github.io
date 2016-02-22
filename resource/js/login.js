
function initLogin(){
    
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = (window.innerWidth - 512)/2 - 100 + 'px';
    container.style.top = (window.innerHeight - 512)/2 - 80 + 'px';
    
    document.body.appendChild( container );

    container.appendChild( createHeart() );

    var btn = document.createElement('div');
    btn.id = 'starButton';
    btn.innerHTML = '<span>开始游戏</span>';
    btn.addEventListener('click',onDocumentClick, false );

    container.appendChild( btn );

}

window.onload  = function(){

    if( window.orientation === 0 ){

        window.orientation = 90;

    }else if( window.orientation === 180 ){

        window.orientation = -90;
        
    }

    initLogin();

};

function onDocumentClick(){
    
    var music =  document.querySelector('#musics span.cs-placeholder').innerHTML;
    if( music !== 'Background music' ){

        localStorage.setItem( 'music', music );

    }else{

        localStorage.setItem( 'music', 'noMusic' );
    }

    var level = document.querySelector('#gameLevels span.cs-placeholder').innerHTML;
    if( isNaN(level) ){

        window.location.href = 'index1.html';

    }else{
        
        window.location.href = 'index'+ level + '.html';

    }

}


function createHeart( ){
    var canvas = document.createElement('canvas');
  
    document.body.appendChild( canvas );

    canvas.width = 512;
    canvas.height = 712;
    canvas.style.zIndex = 1;

    var heartPoints = [
        138, 295,
        95, 227,
        109, 152,
        190, 118,
        240, 145,
        280, 105,
        362, 105,
        402, 173,
        380, 261,
        283, 378,
        189, 328,
        123, 386,
    ];

    var arrowHeadPoints = [
        131, 346,
        123, 386,
        165, 378
    ];

    var arrowPoints = [
        425, 84,
        416, 94.5,
        403, 106,
        378, 132,
        283, 228
    ];

    var fletchPoints1 = [
        447, 81,
        425, 84,
        427, 64,
    ];

    var fletchPoints2 = [
        435, 94,
        416, 94.5,
        417, 76,
    ];

    var fletchPoints3 = [
        423, 105,
        403, 106,
        405, 88
    ];

    var bigStartPoints = [
        240, 145,
        380, 261,
        283, 378,
        189, 328,
        283, 228
    ];

    var towPoints = [
        189, 328,
        123, 386,
    ];

    var context = canvas.getContext('2d');
  
    //画线 
    drawLine(heartPoints);
    drawLine(arrowPoints);
    drawLine(arrowHeadPoints);
    drawLine(fletchPoints1);
    drawLine(fletchPoints2);
    drawLine(fletchPoints3);

    function drawLine( points ){
      
        context.save();
        
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;
        context.shadowBlur = 20;
        context.shadowVColor = '#0c0b51';

        context.lineWidth = 2;
        context.beginPath();
        context.strokeStyle = '#2c75c2';
        context.moveTo( points[0], points[1] );
        for( var i = 2, l = points.length; i < l; i+=2 ){

            context.lineTo( points[i], points[i+1] );

        }

        context.stroke();

        context.restore();

    }
  
    //画星星
    drawMinStar(heartPoints);
    drawMinStar(arrowPoints);
    function drawMinStar( points ){
        
        context.save();

        for( var i = 0, l = points.length; i < l; i+=2 ){

            var gradient = context.createRadialGradient( points[i], points[i+1], 0, points[i], points[i+1], 8 );
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(123,28,192,0.8)');
                gradient.addColorStop(0.4, 'rgba(7,19,241,0.5)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = gradient;
            context.beginPath();
            context.arc( points[i],points[i+1], 8, 0, Math.PI*2 );
            context.fill();
        }

        context.restore();

    }
  
    drawArrow(arrowHeadPoints);
    drawArrow(fletchPoints1);
    drawArrow(fletchPoints2);
    drawArrow(fletchPoints3);

    function drawArrow( points ){

        context.save();
        

        for( var i = 0, l = points.length; i < l; i+=2 ){
            
            if( i === 2 ) continue;

            var gradient = context.createRadialGradient( points[i], points[i+1], 0, points[i], points[i+1], 5 );
                gradient.addColorStop(0, 'rgba(255,255,255,1)');
                gradient.addColorStop(0.2, 'rgba(123,28,192,0.8)');
                gradient.addColorStop(0.4, 'rgba(7,19,241,0.5)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
            context.fillStyle = gradient;
            context.beginPath();
            context.arc( points[i],points[i+1], 5, 0, Math.PI*2 );
            context.fill();

        }

        context.restore();
    }


  
    var img  = new Image();
    img.src = 'resource/img/star.png';
    img.onload = function(){

        drawMaxStar( bigStartPoints );

    };
  
    function drawMaxStar( points ){

        for( var i = 0, l = points.length; i < l; i+=2 ){
            
            context.drawImage( img, points[i] - 10, points[i+1] - 12 );

        }

    }

    
    var moveStarPoint = {x:123, y: 386},
        size = {x:0,y:0},
        stepT = 0.01,
        stepS = 0,
        moveStar = new Image();
        moveStar.src = 'resource/img/star2.png';

    moveStar.onload = function(){
        
        size.x = moveStar.width;
        size.y = moveStar.height;
        animate();
        // context.drawImage( moveStar, moveStarPoint.x - size.x/2 , moveStarPoint.y - size.y/2 );
    };

    function animate(){

        context.save();
        
        context.beginPath();

        context.rect( moveStarPoint.x - size.x/2 , moveStarPoint.y - size.y/2, size.x, canvas.height - moveStarPoint.y + size.y/2 );
        context.clip();
        context.clearRect( 0, 0, canvas.width, canvas.height );
        drawLine(arrowHeadPoints);
        drawArrow(arrowHeadPoints);
        drawLine(towPoints);
        drawMinStar(towPoints);

        if( stepT < 1 ){

            var x = size.x*stepT;
            var y = size.y*stepT;
            // context.rect( moveStarPoint.x - size.x/2 , moveStarPoint.y - size.y/2, size.x, size.y );
            // context.clip();
            // context.clearRect( 0, 0, canvas.width, canvas.height );
            context.drawImage( moveStar, moveStarPoint.x - x/2 , moveStarPoint.y - y/2, x, y );
            stepT += 0.002;

        }else{
            
            context.drawImage( moveStar, moveStarPoint.x - size.x/2 , moveStarPoint.y - size.y/2 + stepS );
            stepS += 0.3;
            if( stepS + moveStarPoint.y - size.y/2 > canvas.height ){
                stepS = 0;
                stepT = 0.01;
            }

        }

        
        context.restore();
        
        requestAnimationFrame( animate );
        
    }
    
    return canvas;

}