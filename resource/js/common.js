    
var Common = {
    
    //window width and height
    w: window.innerWidth,
    h: window.innerHeight,

    //wrapper
    container: null,

    //scene
    sceneBG: null,
    scenePlanet: null,
    sceneSprite: null,

    //camera
    cameraBG: null,
    cameraPlanet: null,
    cameraSprite: null,

    //renderer
    renderer: null,
    composer: null,

    //speed
    speed: 1.0,
    rotationSpeed: 0.01,

    //clock
    clock: new THREE.Clock(),

    //mouse
    mouse: new THREE.Vector2(),

    //图案点
    pattern: null,
    patPosition: new THREE.Vector3(),

    //记录当前点的位置
    currentLocal: 1,
    //记录当前位置已经收集的能量
    currentPower: 0,
    powerArr: null,

    //raycaster
    raycaster: new THREE.Raycaster(),
    
    //planet count
    planetCount: 1,
    dispersionArr: null,

    //background img url
    BGImgURL: '',

    //音乐时长
    duration: 200,

    //循环
    requestAnimate: null,

    //debug
    stats: null,

    init: function(){
        
        //初始化数据
        this.planetCount = GameLevel.planetCount;
        this.speed = GameLevel.speed;
        this.rotationSpeed = GameLevel.rotationSpeed;
        this.BGImgURL = GameLevel.BGImgURL;
        this.dispersionArr = GameLevel.dispersionArr;
        
        this.addMusic();

    },

    addMusic: function(){

        var musicURL =  localStorage.getItem('music');
        var self = this;
        if(  musicURL !== 'noMusic' ){

            var audio = new Audio('resource/MP3/' + musicURL + '.mp3');
            audio.addEventListener('canplaythrough',function(){
                
                self.duration = Math.floor(audio.duration);
                self.powerArr = GameLevel.initLevel( self.duration );
                audio.play();
                self.Timing();
                self.initData();

            });

        }else{
            
            self.powerArr = GameLevel.initLevel( self.duration );
            this.Timing();
            self.initData();

        }
        
    },

    initData: function(){
        
        this.container = document.createElement( 'div' );
        document.body.appendChild( this.container );

        this.stats = this.createStats();

        //create  scene
        this.sceneBG = new THREE.Scene();
        this.scenePlanet = new THREE.Scene();
        this.sceneSprite = new THREE.Scene();

        //create camera
        this.cameraBG = new THREE.OrthographicCamera( -window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000 );
        this.cameraPlanet = new THREE.OrthographicCamera( -window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -100, 2000 );
        this.cameraSprite = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

        //create Render
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( 0x000000 );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.container.appendChild( this.renderer.domElement );
        

        //create Planet
        var array = this.dispersionArr;

        var self = this;
        for( var i = 0; i < array.length; i++ ){

            (function(i){
                var num = array[i];
                setTimeout( function(){

                    for( var i = 0; i < num; i++ ){

                        var mesh = self.createPlanet( new THREE.SphereGeometry( 100, 20, 20 ) );
                        self.scenePlanet.add( mesh );

                    }
                
                }, 550 * i );
            }(i));

        }

        this.cameraPlanet.position.x = 0;
        this.cameraPlanet.position.y = 0;
        this.cameraPlanet.position.z = 50;

        this.cameraPlanet.lookAt(new THREE.Vector3(0, 0, 0));

        //create Sprite

        this.cameraSprite.position.set( 0, 0, 54 );
        this.cameraSprite.lookAt(new THREE.Vector3(0, 0, 0));
        
        //create light
        var ambi = new THREE.AmbientLight(0x181818);
        this.scenePlanet.add(ambi);

        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(500, 100, 500);
        dirLight.intensity = 0.8;

        this.scenePlanet.add(dirLight);

        //create background
        this.createBackground( this.BGImgURL );
        

        //manager pass
        var bgPass = new THREE.RenderPass( this.sceneBG, this.cameraBG );
        var renderPass = new THREE.RenderPass( this.scenePlanet, this.cameraPlanet );
        renderPass.clear = false;
        var renderPass2 = new THREE.RenderPass( this.sceneSprite, this.cameraSprite );
        renderPass2.clear = false;

        var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
        effectCopy.renderToScreen = true;

        this.composer = new THREE.EffectComposer( this.renderer );
        this.composer.renderTarget1.stencilBuffer = true;
        this.composer.renderTarget2.stencilBuffer = true;

        this.composer.addPass( bgPass );
        this.composer.addPass( renderPass );
        this.composer.addPass( renderPass2 );
        this.composer.addPass( effectCopy );

        this.animate();

        window.addEventListener( 'resize', function(){

            self.onWindowResize();

        }, false );

        // window.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        // window.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
        window.addEventListener( 'mousedown', function( event ){

            self.onDocumentMouseDown( event );

        }, false );

        window.addEventListener( 'touchstart', function( event ){

            self.onDocumentTouchStart( event );

        }, false );

    },

    //事件处理
    onWindowResize: function(){
        
        var w = window.innerWidth,
            h = window.innerHeight;

        this.w = w;
        this.h = h; 
        this.cameraBG.left =  -w;
        this.cameraBG.right = w;
        this.cameraBG.top = h;
        this.cameraBG.bottom = -h;

        this.cameraPlanet.left =  -w;
        this.cameraPlanet.right = w;
        this.cameraPlanet.top = h;
        this.cameraPlanet.bottom = -h;

        this.cameraSprite.aspect = w/h;      

        this.cameraBG.updateProjectionMatrix();
        this.cameraPlanet.updateProjectionMatrix();
        this.cameraSprite.updateProjectionMatrix();

        this.renderer.setSize( w, h );

    },

    onDocumentTouchStart: function( event ){
        
        event.preventDefault();

        event.clientX = event.touches[0].clientX;
        event.clientY = event.touches[0].clientY;

        this.onDocumentMouseDown( event );

    },

    onDocumentMouseDown: function( event ){
        
        event.preventDefault();

        this.mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) *2 + 1;

        this.raycaster.setFromCamera( this.mouse, this.cameraPlanet );

        var intersects = this.raycaster.intersectObjects( this.scenePlanet.children );
        
        if( intersects.length > 0 ){

            var v3 = intersects[0].object.position.clone();
            var scale = intersects[0].object.scale.x;
            
            this.scenePlanet.remove( intersects[0].object );

            this.createPointCloud( v3, scale );

            var mesh = this.createPlanet( new THREE.SphereGeometry( 100, 20, 20 ) );
            this.scenePlanet.add( mesh );

        }

    },

    //generate sprite
    generateSprite: function(){

        var canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;

        var ctx = canvas.getContext('2d');
       
        var halfW = canvas.width/2;
        var halfH = canvas.height/2;
        var gradient = ctx.createRadialGradient( halfW, halfH, 0, halfW, halfH, halfW );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        ctx.fillStyle = gradient;
        ctx.fillRect( 0, 0, canvas.width, canvas.height );

        var texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;

        return texture;

    },

    createPointCloud: function( v3, scale ){
        
        var geom = new THREE.SphereGeometry( 3, 20, 20 );
        var material = new THREE.PointCloudMaterial({
            color: 0xffffff,
            size: 4,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: this.generateSprite(),
        });

        var cloud = new THREE.PointCloud( geom, material );
        cloud.sortParticles = true;
        var x = ( v3.x / this.w ) * 45;
        var y = ( v3.y / this.h ) * 22;
        // cloud.position.set( v3.x, v3.y, 0 );
        cloud.position.set( x, y, 0 );
        cloud.scale.set( scale, scale, scale );
    
        this.sceneSprite.add( cloud );
        
        this.makeSpriteMove( cloud );

        //判断当前位置的能量是否已满
        this.checkPower();

    },

    //active sprite
    makeSpriteMove: function( sprite ){
        
        sprite.geometry.vertices.forEach(function (e) {

            new TWEEN.Tween( e ).to( {
                x: 0,
                y: 0,
                z: 0 }, 3000 )
            .easing( TWEEN.Easing.Elastic.Out).start();

        });

        new TWEEN.Tween( sprite.position ).to( {
            x: this.patPosition.x,
            y: this.patPosition.y,
            z: this.patPosition.z }, 3000 )
        .easing( TWEEN.Easing.Elastic.Out).start();

    },

    checkPower: function(){
        
        this.currentPower++;

        if( this.currentPower >= this.powerArr[ this.currentLocal - 1 ] && this.currentLocal <= this.powerArr.length ){

            this.currentPower = 0;
            this.currentLocal++;
            this.addPictureToBG();

        }

    },

    //create Planet
    createPlanet: function( geom ){

        var num = ~~(Math.random()* this.planetCount );

        var materialColor = new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture( 'resource/img/planet/' + num + '.jpg' ),
        });

        var planet = new THREE.Mesh( geom, materialColor );
        //x: -40 - 40  -800 - 800
        //y: -20 - 20  -400 - 400
        //z: 0 - -1000 -1000 - -2000
        planet.position.set(
            Math.random()*this.w*2 - this.w,
            Math.random()*this.h*2 - this.h,
            -Math.random()*1500);
        var scale = Math.random()*0.001 + 0.000001;
        planet.scale.set( scale, scale, scale );
        
        return planet;

    },
    
    //创建背景
    createBackground: function( texture ){
        
        var materialColor = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( 'resource/img/background/' + texture ),
            depthTest: false
        });

        var bgPlane = new THREE.Mesh( new THREE.PlaneGeometry(1,1), materialColor );
        bgPlane.position.z = -100;
        bgPlane.scale.set( 2*window.innerWidth, 2*window.innerHeight, 1 );

        this.sceneBG.add( bgPlane );
        
        this.addPictureToBG();

    },


    //创建图案
    addPictureToBG: function(){
        
        if( this.pattern ){

            this.sceneBG.remove( this.pattern );

        }
        var data = GameLevel.addPictureToBG( this.currentLocal );
        this.pattern = data.pattern;

        var x = 45 * ((data.patPosition.x - this.pattern.geometry.parameters.width/2)*2 + this.pattern.position.x) / this.w;
        var y = 22 * ((this.pattern.geometry.parameters.height/2 - data.patPosition.y)*2 + this.pattern.position.y) / this.h;

        this.patPosition.set( x, y, 0 );
 
        this.sceneBG.add( this.pattern );

    },

    animate: function(){
        
        var self = this;

        this.requestAnimate  = window.requestAnimationFrame(function( time ){

            self.animate.call(self,time);

        });
        
        this.scenePlanet.traverse(function (e) {
            if (e instanceof THREE.Mesh) {

                e.rotation.x += self.rotationSpeed;
                e.rotation.y += self.rotationSpeed;
                e.rotation.z += self.rotationSpeed;
                
                var s = e.scale.x * self.speed;
                if( s < 1){

                    e.scale.set( s, s, s );

                }else{

                    e.position.set(
                    Math.random()*self.w*2 - self.w,
                    Math.random()*self.h*2 - self.h,
                    -Math.random()*1500);
                    var scale = Math.random()*0.001 + 0.000001;
                    e.scale.set( scale, scale, scale );

                }
                
            }
        });

        this.sceneSprite.traverse(function (e) {

            if (e instanceof THREE.PointCloud ) {
                
                if( e.position.equals( self.patPosition ) ){

                    self.sceneSprite.remove( e );

                }
                
            }

        });
        
        this.render();

    },

    render: function(){
        
        this.renderer.autoClear = false;
        this.stats.update();
        TWEEN.update();

        var delta = this.clock.getDelta();
        
        this.composer.render( delta );

    },

    //测试运行情况
    createStats: function(){

        var stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = 0;
        stats.domElement.style.left = 0;

        this.container.appendChild( stats.domElement );

        return stats;

    },

    Timing: function(){

        
        var self = this;
        
        setTimeout(function(){

            cancelAnimationFrame( self.requestAnimate );
            
            if( self.currentLocal > self.powerArr.length ){

                GameOver.generateDom( true );

            }else{

                GameOver.generateDom( false );

            }

            //清空能量
            self.scenePlanet.traverse(function (e) {
                if (e instanceof THREE.Mesh) {

                    self.scenePlanet.remove( e );
                    
                }
            });
            self.sceneSprite.traverse(function (e) {

                    self.sceneSprite.remove( e );

            });

        }, self.duration * 1000 );

    }


};

var GameOver = {
    
    wrapDom:null,

    generateDom: function( flag ){
         
        this.wrapDom = document.createElement('div');
        var width = window.innerWidth/2;
        var height = window.innerHeight/2 + 60;

        this.wrapDom.id = 'gameOver';
        this.wrapDom.style.width = width + 'px';
        this.wrapDom.style.height = height + 'px';

        this.wrapDom.style.background = '#fff';

        this.wrapDom.style.position = 'fixed';
        this.wrapDom.style.left = window.innerWidth/2 - width/2 + 'px';
        this.wrapDom.style.top = window.innerHeight/2 - height/2 + - 30 + 'px';

        var title = document.createElement('div');
        title.id = 'title';
        title.style.textAlign = 'center';
        if( flag ){
            title.innerText = '恭喜你，完美完成任务！';
        }else{
            title.innerText = '很遗憾，未能完成任务！';
        }
        

        this.wrapDom.appendChild( title );
        this.wrapDom.appendChild( this.generateCanvas() );
        this.wrapDom.appendChild( this.generateBtn() );

        document.body.appendChild( this.wrapDom );

    },

    generateBtn: function(){

        var div = document.createElement( 'div' );
        div.id = 'btn';

        var btn1 = document.createElement( 'spand' );
        var btn2 = document.createElement( 'spand' );
        var btn3 = document.createElement( 'spand' );

        var width = window.innerWidth/6;

        
        btn1.innerHTML = '重新挑战';
        btn2.innerHTML = '分享朋友圈';
        btn3.innerHTML = '返回';

        btn1.style.width = width + 'px';
        btn2.style.width = width + 'px';
        btn3.style.width = width + -4 + 'px';

        btn1.style.borderRight = '2px solid #fff';
        btn2.style.borderRight = '2px solid #fff';
        
        var self = this;
        btn1.addEventListener( 'click', function(){ 

            self.restart();

        });

        btn2.addEventListener( 'click', function(){

            wx.onMenuShareTimeline({

                title: '给你一首歌的时间', // 分享标题
                link: '', // 分享链接
                imgUrl: '', // 分享图标
                success: function () { 
                     // 用户确认分享后执行的回调函数
                },
                cancel: function () { 
                     // 用户取消分享后执行的回调函数
                }

            });
        });

        btn3.addEventListener( 'click', function(){
            
            window.location.href = 'index.html';

        });

        div.appendChild( btn1 );
        div.appendChild( btn2 );
        div.appendChild( btn3 );

        return div;

    },

    restart: function(){
        
        // console.log('1ddd');
        document.body.removeChild( this.wrapDom );
        window.location.reload();

    },

    generateCanvas: function(){

        var canvas = document.createElement('canvas');
        canvas.width = window.innerWidth/2;
        canvas.height = window.innerHeight/2;

        var context = canvas.getContext( '2d' );
        
        var img = new Image();
        img.src = 'resource/img/background/' + Common.BGImgURL;

        img.onload = function(){

            context.drawImage(img, 0, 0, canvas.width, canvas.height );

            var w = GameLevel.canvas.width/2;
            var h = GameLevel.canvas.height/2;

            context.drawImage(GameLevel.canvas, canvas.width/2 - w, canvas.height/2 - h + 80, w*2, h*2 );

        };

        return canvas;
        
    }

};

window.onload = function(){

    Common.init();

};

