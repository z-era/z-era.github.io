

var GameLevel = {
    
    //背景图片
    BGImgURL: 'starry.jpg',

    canvas: null,
    context: null,
    pattern: null,

    //星球数量
    planetCount: 18,

    //星球速度
    speed: 1.02,
    rotationSpeed: 0.01,

    //缩放
    scale: window.innerWidth * 0.375 / 512,
    
    //星球的分散度以及数量
    dispersionArr: [ 3, 4, 6, 4, 3 ],

    //犀牛显现没部分所诉能量比率
    ratio: [0.05, 0.1, 0.15, 0.15, 0.2, 0.1, 0.1, 0.05 ],

    initLevel: function( duration ){
        
        var powerArr = [];
        for( var i = 0, l = this.ratio.length; i < l; i ++ ){

            powerArr[i] = Math.round( duration * 2 * this.ratio[i] );

        }

        this.initCanvas();

        return powerArr;

    },

    //创建犀牛
    addPictureToBG: function( count ){

        var self = this;
        this.draw( Sources.Cattle[ 'order'+count ] );

        var materialColor = new THREE.MeshBasicMaterial({
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: self.createTexture(),
        });

        this.pattern = new THREE.Mesh( new THREE.PlaneGeometry( 512*this.scale, 512*this.scale ), materialColor );
        this.pattern.position.set( -800, -500, -10000 );
        this.pattern.scale.set( 2, 2, 1 );

        // var x = 45 * ((Sources.CattleFocus.x - this.pattern.geometry.parameters.width/2)*2 + this.pattern.position.x) / Data.w;
        // var y = 22 * ((this.pattern.geometry.parameters.height/2 - Sources.createCattle.eye.y)*2 + this.pattern.position.y) / Data.h;

        // Data.patPosition.set( x, y, 0 );

        return {

            pattern: this.pattern,
            patPosition:new THREE.Vector2( Sources.CattleFocus.x * this.scale, Sources.CattleFocus.y * this.scale )

        };

    },

    createTexture: function(){
        
        var texture = new THREE.Texture( this.canvas );
        texture.needsUpdate = true;

        return texture;

    },

    initCanvas: function(){

        this.canvas = document.createElement( 'canvas' );
        this.canvas.width = 512;
        this.canvas.height = 512;

        this.context = this.canvas.getContext('2d');

        this.context.fillStyle = '#95a9ff';
        this.context.strokeStyle = 'rgb(150,197,255)';

        this.context.shadowOffsetX = 2; // 阴影Y轴偏移
        this.context.shadowOffsetY = 2; // 阴影X轴偏移
        this.context.shadowBlur = 20; // 模糊尺寸
        this.context.shadowColor = '#019bfd'; // 颜色

        this.context.strokeStyle = 'rgb(150,197,255)';
        this.context.lineWidth = 2;
        
        this.context.scale( this.scale, this.scale );

        this.drawEye();

    },

    drawEye: function(){
        
        this.draw( Sources.Cattle.order1 );
        this.context.fill();

    },



    draw: function( points ){
        
        this.context.beginPath();
        
        this.context.moveTo( points[0], points[1] );

        for( var i = 2; i < points.length; i += 2 ){

            this.context.lineTo( points[i], points[i+1] );

        }
        this.context.stroke();

    }


};
