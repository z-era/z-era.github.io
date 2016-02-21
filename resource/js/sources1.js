var Sources = {
    
      //星球聚集点
      CattleFocus: { x: 80, y: 175 },
      //创建星空上的犀牛
      Cattle : {

            //眼睛
            order1: [
            81, 175,
            86, 179,
            95, 160,
            81, 175],
            
            //头部
            order2 : [
            24, 95,
            23, 118,
            22, 142,
            23, 165,
            23.6, 189,
            33, 212.6,
            47.6, 237,
            79, 213,
            63, 238,
            71, 246,
            94.5, 223,
            127, 212.6,
            141.7, 211,
            163, 203,
            162.5, 189,
            157.5, 165.5,
            152, 141.7,
            138, 118,
            118, 94.5,
            84, 71,
            86, 96,
            104, 94,
            63, 160,
            48, 133,
            47, 178,
            24, 95
            ],

            //上半身
            order3: [
            123, 90,
            141.7, 107,
            156, 130,
            165.4, 152,
            173, 182,
            189, 176,
            213, 172,
            236, 178,
            264, 200,
            272, 165,
            275, 142,
            274, 118,
            273, 83,
            267, 61,
            210, 25,
            178, 42,
            214, 72,
            153, 38,
            120, 88,
            123, 90
            ],

            //前脚1
            order4: [
            174, 196,
            198, 225,
            213, 246,
            204, 271,
            189, 284,
            256, 284,
            246, 271,
            260, 228,
            256, 204,
            245, 189,
            225, 181,
            200, 180,
            174, 196
            ],
            
            //前脚2
            order5: [
            167, 212,
            141, 271,
            118, 284,
            180, 284,
            175, 271,
            198, 250,
            180, 238,
            167, 212
            ],

            //腰
            order6: [
            271, 58,
            284, 95,
            285, 128,
            284, 165,
            273, 204,
            307, 203,
            332, 189,
            330, 152,
            333, 118,
            341, 94.5,
            355, 71,
            366, 57,
            341, 47,
            307, 60,
            271, 58
            ],

            //后脚1
            order7: [
            308, 212,
            321, 236,
            307, 270,
            285, 284,
            352, 284,
            345, 270,
            368, 236,
            339, 202,
            308, 212
            ],

            //后脚2
            order8: [
            393, 47,
            378, 56,
            365, 71,
            353, 94.5,
            343, 118,
            339, 141,
            340, 165,
            344, 189,
            356, 212,
            378, 234,
            390, 238,
            378, 272,
            360, 284,
            427, 284,
            423, 272,
            436, 236,
            434, 223,
            425, 212,
            449, 178,
            460, 141,
            459, 108,
            448, 83,
            425, 60,
            393, 47,
            ],

            //尾巴
            order19: [
            463, 162,
            458, 175,
            474, 198,
            497, 221,
            494, 202,
            474, 198,
            463, 162
            ],

      }
      // //创建星空上的犀牛
      // createCattle : function(){

      //       var canvas = document.createElement('canvas');
      //       canvas.width = 512;
      //       canvas.height = 512;

      //       var ctx = canvas.getContext('2d');
            
      //       //头部
      //       var points = [
      //       24, 95,
      //       23, 118,
      //       22, 142,
      //       23, 165,
      //       23.6, 189,
      //       33, 212.6,
      //       47.6, 237,
      //       79, 213,
      //       63, 238,
      //       71, 246,
      //       94.5, 223,
      //       127, 212.6,
      //       141.7, 211,
      //       163, 203,
      //       162.5, 189,
      //       157.5, 165.5,
      //       152, 141.7,
      //       138, 118,
      //       118, 94.5,
      //       84, 71,
      //       86, 96,
      //       104, 94,
      //       63, 160,
      //       48, 133,
      //       47, 178,
      //       24, 95
      //       ];
            
      //       //眼睛
      //       var eyePoints = [
      //       81, 175,
      //       86, 179,
      //       95, 160,
      //       81, 175];

      //       //上半身
      //       var upBodyPoints =[
      //       123, 90,
      //       141.7, 107,
      //       156, 130,
      //       165.4, 152,
      //       173, 182,
      //       189, 176,
      //       213, 172,
      //       236, 178,
      //       264, 200,
      //       272, 165,
      //       275, 142,
      //       274, 118,
      //       273, 83,
      //       267, 61,
      //       210, 25,
      //       178, 42,
      //       214, 72,
      //       153, 38,
      //       120, 88,
      //       123, 90];

      //       //前脚1
      //       var foot1Points = [
      //       174, 196,
      //       198, 225,
      //       213, 246,
      //       204, 271,
      //       189, 284,
      //       256, 284,
      //       246, 271,
      //       260, 228,
      //       256, 204,
      //       245, 189,
      //       225, 181,
      //       200, 180,
      //       174, 196];
            
      //       //前脚2
      //       var foot2Points = [
      //       167, 212,
      //       141, 271,
      //       118, 284,
      //       180, 284,
      //       175, 271,
      //       198, 250,
      //       180, 238,
      //       167, 212
      //       ];

      //       //腰
      //       var waistPoints = [
      //       271, 58,
      //       284, 95,
      //       285, 128,
      //       284, 165,
      //       273, 204,
      //       307, 203,
      //       332, 189,
      //       330, 152,
      //       333, 118,
      //       341, 94.5,
      //       355, 71,
      //       366, 57,
      //       341, 47,
      //       307, 60,
      //       271, 58
      //       ];

      //       //后脚1
      //       var foot3Points = [
      //       308, 212,
      //       321, 236,
      //       307, 270,
      //       285, 284,
      //       352, 284,
      //       345, 270,
      //       368, 236,
      //       339, 202,
      //       308, 212
      //       ];

      //       //后脚2
      //       var foot4Points =[
      //       393, 47,
      //       378, 56,
      //       365, 71,
      //       353, 94.5,
      //       343, 118,
      //       339, 141,
      //       340, 165,
      //       344, 189,
      //       356, 212,
      //       378, 234,
      //       390, 238,
      //       378, 272,
      //       360, 284,
      //       427, 284,
      //       423, 272,
      //       436, 236,
      //       434, 223,
      //       425, 212,
      //       449, 178,
      //       460, 141,
      //       459, 108,
      //       448, 83,
      //       425, 60,
      //       393, 47,
      //       ];

      //       //尾巴
      //       var tailPoints = [
      //       463, 162,
      //       458, 175,
      //       474, 198,
      //       497, 221,
      //       494, 202,
      //       474, 198,
      //       463, 162
      //       ];

      //       ctx.fillStyle = '#95a9ff';

      //       ctx.save();

      //       ctx.shadowOffsetX = 2; // 阴影Y轴偏移
      //       ctx.shadowOffsetY = 2; // 阴影X轴偏移
      //       ctx.shadowBlur = 20; // 模糊尺寸
      //       ctx.shadowColor = '#019bfd'; // 颜色

      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.lineWidth = 2;
            
      //       //画头
      //       ctx.beginPath();
      //       ctx.moveTo( 24, 95 );

      //       for( var i = 2; i < points.length; i += 2 ){

      //           ctx.lineTo( points[i], points[i+1] );

      //       }
      //       ctx.stroke();


      //       //画眼
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( eyePoints[0], eyePoints[1] );

      //       for( var i = 2; i < eyePoints.length; i += 2 ){

      //           ctx.lineTo( eyePoints[i], eyePoints[i+1] );

      //       }
      //       ctx.stroke();
      //       ctx.fill();

      //       //画上半身
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( upBodyPoints[0], upBodyPoints[1] );

      //       for( var i = 2; i < upBodyPoints.length; i += 2 ){

      //           ctx.lineTo( upBodyPoints[i], upBodyPoints[i+1] );

      //       }
      //       ctx.stroke();


      //       //画脚1
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( foot1Points[0], foot1Points[1] );

      //       for( var i = 2; i < foot1Points.length; i += 2 ){

      //           ctx.lineTo( foot1Points[i], foot1Points[i+1] );

      //       }
      //       ctx.stroke();

      //       //画脚2
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( foot2Points[0], foot2Points[1] );

      //       for( var i = 2; i < foot2Points.length; i += 2 ){

      //           ctx.lineTo( foot2Points[i], foot2Points[i+1] );

      //       }
      //       ctx.stroke();

      //       //画腰
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( waistPoints[0], waistPoints[1] );

      //       for( var i = 2; i < waistPoints.length; i += 2 ){

      //           ctx.lineTo( waistPoints[i], waistPoints[i+1] );

      //       }
      //       ctx.stroke();

      //       //画脚3
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( foot3Points[0], foot3Points[1] );

      //       for( var i = 2; i < foot3Points.length; i += 2 ){

      //           ctx.lineTo( foot3Points[i], foot3Points[i+1] );

      //       }
      //       ctx.stroke();

      //       //画脚4
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( foot4Points[0], foot4Points[1] );

      //       for( var i = 2; i < foot4Points.length; i += 2 ){

      //           ctx.lineTo( foot4Points[i], foot4Points[i+1] );

      //       }
      //       ctx.stroke();

      //       //画尾巴
      //       ctx.beginPath();
      //       ctx.strokeStyle = 'rgb(150,197,255)';
      //       ctx.moveTo( tailPoints[0], tailPoints[1] );

      //       for( var i = 2; i < tailPoints.length; i += 2 ){

      //           ctx.lineTo( tailPoints[i], tailPoints[i+1] );

      //       }
      //       ctx.stroke();

      //       ctx.restore();

      //       var textrue = new THREE.Texture( canvas );
      //       textrue.needsUpdate = true;

      //       return textrue;

      // }
};
