
// var Data = {
//     //window width and height
//     w: window.innerWidth,
//     h: window.innerHeight,

// 	//wrapper
//     container: null,

//     //scene
//     sceneBG: null,
//     scenePlanet: null,
//     sceneSprite: null,

//     //camera
//     cameraBG: null,
//     cameraPlanet: null,
//     cameraSprite: null,

//     //renderer
//     renderer: null,
//     composer: null,

//     //speed
//     speed: 1.0,
//     rotationSpeed: 0.01,

//     //clock
//     clock: new THREE.Clock(),

//     //mouse
//     mouse: new THREE.Vector2(),

//     //图案
//     pattern: null,
//     patPosition: new THREE.Vector3(),

//     //raycaster
//     raycaster: new THREE.Raycaster(),

//     //debug
//     stats: null
// };

// function init(){
    
//     Data.container = document.createElement( 'div' );
//     document.body.appendChild( Data.container );

//     Data.stats = createStats();

//     //create  scene
//     Data.sceneBG = new THREE.Scene();
//     Data.scenePlanet = new THREE.Scene();
//     Data.sceneSprite = new THREE.Scene();

//     //create camera
//     Data.cameraBG = new THREE.OrthographicCamera( -window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000 );
//     Data.cameraPlanet = new THREE.OrthographicCamera( -window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -100, 2000 );
//     Data.cameraSprite = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

//     //create Render
//     Data.renderer = new THREE.WebGLRenderer();
//     // Data.renderer.setPixelRatio( window.devicePixelRatio );
//     Data.renderer.setClearColor( 0x000000 );
//     Data.renderer.setSize( window.innerWidth, window.innerHeight );

//     Data.container.appendChild( Data.renderer.domElement );
    

//     //create Planet
//     for( var i = 0; i < 15; i++ ){

//     	var mesh = createPlanet( new THREE.SphereGeometry( 100, 20, 20 ), 18 );
//     	Data.scenePlanet.add( mesh );

//     }

//     Data.cameraPlanet.position.x = 0;
//     Data.cameraPlanet.position.y = 0;
//     Data.cameraPlanet.position.z = 50;

//     Data.cameraPlanet.lookAt(new THREE.Vector3(0, 0, 0));

//     //create Sprite

//     // for( var i = 0; i < 1; i++ ){

//     //     var mesh = createPointCloud( new THREE.SphereGeometry( 3, 15, 15 ));
//     //     Data.sceneSprite.add( mesh );

//     // }
//     // x: 45
//     // y: 24
//     Data.cameraSprite.position.set( 0, 0, 54 );
//     Data.cameraSprite.lookAt(new THREE.Vector3(0, 0, 0));
    

//     // createPointCloud( {x:0,y:23,z:0}, 1 );
//     // createPointCloud( {x:0,y:24,z:0}, 1 );


//     //create light
//     var ambi = new THREE.AmbientLight(0x181818);
//     Data.scenePlanet.add(ambi);

//     var dirLight = new THREE.DirectionalLight(0xffffff);
//     dirLight.position.set(500, 100, 500);
//     dirLight.intensity = 0.8;

//     Data.scenePlanet.add(dirLight);

//     //create background
//     createBackground( 'starry.jpg' );
    

//     //manager pass
//     var bgPass = new THREE.RenderPass( Data.sceneBG, Data.cameraBG );
//     var renderPass = new THREE.RenderPass( Data.scenePlanet, Data.cameraPlanet );
//     renderPass.clear = false;
//     var renderPass2 = new THREE.RenderPass( Data.sceneSprite, Data.cameraSprite );
//     renderPass2.clear = false;

//     var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
//     effectCopy.renderToScreen = true;

//     Data.composer = new THREE.EffectComposer( Data.renderer );
//     Data.composer.renderTarget1.stencilBuffer = true;
//     Data.composer.renderTarget2.stencilBuffer = true;

//     Data.composer.addPass( bgPass );
//     Data.composer.addPass( renderPass );
//     Data.composer.addPass( renderPass2 );
//     Data.composer.addPass( effectCopy );

//     animate();

//     window.addEventListener( 'resize', onWindowResize, false );

//     window.addEventListener( 'mousedown', onDocumentMouseDown, false );
//     window.addEventListener( 'touchstart', onDocumentTouchStart, false );

// }

// //事件处理
// function onWindowResize(){
    
//     var w = window.innerWidth,
//         h = window.innerHeight;

//     Data.w = w;
//     Data.h = h; 
//     Data.cameraBG.left =  -w;
//     Data.cameraBG.right = w;
//     Data.cameraBG.top = h;
//     Data.cameraBG.bottom = -h;

//     Data.cameraPlanet.left =  -w;
//     Data.cameraPlanet.right = w;
//     Data.cameraPlanet.top = h;
//     Data.cameraPlanet.bottom = -h;

//     Data.cameraSprite.aspect = w/h;      

//     Data.cameraBG.updateProjectionMatrix();
//     Data.cameraPlanet.updateProjectionMatrix();
//     Data.cameraSprite.updateProjectionMatrix();

//     Data.renderer.setSize( w, h );

// }

// function onDocumentTouchStart( event ){
    
//     event.preventDefault();

//     event.clientX = event.touches[0].clientX;
//     event.clientY = event.touches[0].clientY;

//     onDocumentMouseDown( event );

// }

// function onDocumentMouseDown( event ){
    
//     event.preventDefault();

//     Data.mouse.x = ( event.clientX / Data.renderer.domElement.clientWidth ) * 2 - 1;
//     Data.mouse.y = - ( event.clientY / Data.renderer.domElement.clientHeight ) *2 + 1;

//     Data.raycaster.setFromCamera( Data.mouse, Data.cameraPlanet );

//     var intersects = Data.raycaster.intersectObjects( Data.scenePlanet.children );
    
//     if( intersects.length > 0 ){

//         var v3 = intersects[0].object.position.clone();
//         var scale = intersects[0].object.scale.x;
        
//         Data.scenePlanet.remove( intersects[0].object );

//         createPointCloud( v3, scale );

//         var mesh = createPlanet( new THREE.SphereGeometry( 100, 20, 20 ), 3 );
//         Data.scenePlanet.add( mesh );

//     }

// }

// //generate sprite
// function generateSprite(){

//     var canvas = document.createElement( 'canvas' );
//     canvas.width = 16;
//     canvas.height = 16;

//     var ctx = canvas.getContext('2d');
   
//     var halfW = canvas.width/2;
//     var halfH = canvas.height/2;
//     var gradient = ctx.createRadialGradient( halfW, halfH, 0, halfW, halfH, halfW );
//     gradient.addColorStop(0, 'rgba(255,255,255,1)');
//     gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
//     gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
//     gradient.addColorStop(1, 'rgba(0,0,0,1)');

//     ctx.fillStyle = gradient;
//     ctx.fillRect( 0, 0, canvas.width, canvas.height );

//     var texture = new THREE.Texture( canvas );
//     texture.needsUpdate = true;

//     return texture;

// }

// function createPointCloud( v3, scale ){
    
//     var geom = new THREE.SphereGeometry( 3, 20, 20 );
//     var material = new THREE.PointCloudMaterial({
//         color: 0xffffff,
//         size: 4,
//         transparent: true,
//         blending: THREE.AdditiveBlending,
//         map: generateSprite(),
//     });

//     var cloud = new THREE.PointCloud( geom, material );
//     cloud.sortParticles = true;
//     var x = ( v3.x / Data.w ) * 45;
//     var y = ( v3.y / Data.h ) * 22;
//     // cloud.position.set( v3.x, v3.y, 0 );
//     cloud.position.set( x, y, 0 );
//     cloud.scale.set( scale, scale, scale );

//     Data.sceneSprite.add( cloud );
    
//     makeSpriteMove( cloud );
// }

// //active sprite
// function makeSpriteMove( sprite ){
    
//     sprite.geometry.vertices.forEach(function (e) {

//         new TWEEN.Tween( e ).to( {
//             x: 0,
//             y: 0,
//             z: 0 }, 3000 )
//         .easing( TWEEN.Easing.Elastic.Out).start();

//     });

//     new TWEEN.Tween( sprite.position ).to( {
//         x: Data.patPosition.x,
//         y: Data.patPosition.y,
//         z: Data.patPosition.z }, 3000 )
//     .easing( TWEEN.Easing.Elastic.Out).start();

// }

// //create Planet
// function createPlanet( geom,count ){

// 	var num = ~~(Math.random()* count );
//     var materialColor = new THREE.MeshPhongMaterial({
//     	map: THREE.ImageUtils.loadTexture( 'resource/img/planet/' + num + '.jpg' ),
//     });

// 	var planet = new THREE.Mesh( geom, materialColor );
// 	//x: -40 - 40  -800 - 800
// 	//y: -20 - 20  -400 - 400
// 	//z: 0 - -1000 -1000 - -2000
// 	planet.position.set(
//         Math.random()*Data.w*2 - Data.w,
//         Math.random()*Data.h*2 - Data.h,
//         -Math.random()*1500);
//     // planet.position.set(0,0,0);
//     var scale = Math.random()*0.001 + 0.000001;
//     planet.scale.set( scale, scale, scale );
    
//     return planet;

// }

//create background
// function createBackground( texture ){
    
//     var materialColor = new THREE.MeshBasicMaterial({
//     	map: THREE.ImageUtils.loadTexture( 'resource/img/background/' + texture ),
//     	depthTest: false
//     });

// 	var bgPlane = new THREE.Mesh( new THREE.PlaneGeometry(1,1), materialColor );
// 	bgPlane.position.z = -100;
// 	bgPlane.scale.set( 2*window.innerWidth, 2*window.innerHeight, 1 );

// 	Data.sceneBG.add( bgPlane );
    
//     addPictureToBG();

// }

// //创建犀牛
// function addPictureToBG(){
    
//         var materialColor = new THREE.MeshBasicMaterial({
//             transparent: true,
//             blending: THREE.AdditiveBlending,
//             map: Sources.createCattle(),
//         });

//         Data.pattern = new THREE.Mesh( new THREE.PlaneGeometry(512,512), materialColor );
//         Data.pattern.position.set( -800, -500, -10000 );
//         Data.pattern.scale.set( 2, 2, 1 );

//         var x = 45 * ((Sources.createCattle.eye.x - Data.pattern.geometry.parameters.width/2)*2 + Data.pattern.position.x) / Data.w;
//         var y = 22 * ((Data.pattern.geometry.parameters.height/2 - Sources.createCattle.eye.y)*2 + Data.pattern.position.y) / Data.h;
//         Data.patPosition.set( x, y, 0 );

//         Data.sceneBG.add( Data.pattern );

// }


// function animate(){
    
//     requestAnimationFrame( animate );
    
//     Data.scenePlanet.traverse(function (e) {
//         if (e instanceof THREE.Mesh) {

//             e.rotation.x += Data.rotationSpeed;
//             e.rotation.y += Data.rotationSpeed;
//             e.rotation.z += Data.rotationSpeed;
            
//             var s = e.scale.x * 1.02;
//             if( s < 1){
//                 e.scale.set( s, s, s );
//             }else{
//                 e.position.set(
//                 Math.random()*Data.w*2 - Data.w,
//                 Math.random()*Data.h*2 - Data.h,
//                 -Math.random()*1500);
//                 var scale = Math.random()*0.001 + 0.000001;
//                 e.scale.set( scale, scale, scale );

//             }
            
//         }
//     });

//     Data.sceneSprite.traverse(function (e) {

//         if (e instanceof THREE.PointCloud ) {
            
//             if( e.position.equals( Data.patPosition ) ){

//                 Data.sceneSprite.remove( e );

//             }
            
//         }

//     });

    
//     render();

// }

// function render(){
    
//     Data.renderer.autoClear = false;
//     Data.stats.update();
//     TWEEN.update();

//     var delta = Data.clock.getDelta();
    
//     Data.composer.render( delta );

// }

// function createStats(){

// 	var stats = new Stats();

// 	stats.domElement.style.position = 'absolute';
// 	stats.domElement.style.top = 0;
//     stats.domElement.style.left = 0;

//     Data.container.appendChild( stats.domElement );

//     return stats;

// }


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

        this.pattern = new THREE.Mesh( new THREE.PlaneGeometry(512,512), materialColor );
        this.pattern.position.set( -800, -500, -10000 );
        this.pattern.scale.set( 2, 2, 1 );

        // var x = 45 * ((Sources.CattleFocus.x - this.pattern.geometry.parameters.width/2)*2 + this.pattern.position.x) / Data.w;
        // var y = 22 * ((this.pattern.geometry.parameters.height/2 - Sources.createCattle.eye.y)*2 + this.pattern.position.y) / Data.h;

        // Data.patPosition.set( x, y, 0 );

        return {

            pattern: this.pattern,
            patPosition:new THREE.Vector2( Sources.CattleFocus.x, Sources.CattleFocus.y )

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
