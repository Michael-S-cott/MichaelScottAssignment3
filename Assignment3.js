//author: Michael Scott
//date: 3-2-21
//description: Creates rotating red square and purple triangle which moves left and right from center using A and D

//proposed points (out of 10): 10 
// I think most of the objectives were met.


"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var atheta = 0.0;//Theta variables for triangle
var athetaLoc;

var vertices;
var verticesTriangle;
var program;
var programTriangle;

var direction = true; //For button
var speed = 0.1; //For slider
var left = 0; //for keys
var right = 0;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [//square vertex coordinates
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

   verticesTriangle = [//triangle vertex coordinates
        vec2(0, 1), 
        vec2(0.2, 0.7), 
        vec2(-0.2, 0.7)
        ];

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    //use vertex-shader and fragment shader

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    //sets theta location to uTheta in html file

    programTriangle = initShaders(gl, "vertex-shader2", "fragment-shader2");
    //use vertex-shader2 and fragment-shader2, which gives the triangle different shaders than the square

    athetaLoc = gl.getUniformLocation(programTriangle, "vTheta");
    //athetaLoc set to "vTheta" in html file


    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    athetaLoc = gl.getUniformLocation(programTriangle, "vTheta");



    document.getElementById("Direction").onclick = function() { //Button code
        console.log("Button is working");
        direction = !direction;
        
    }

    document.getElementById("slider").onchange = function(event) {  //Slider code
         speed = parseFloat(event.target.value);//slider affects rotation speed
         console.log("Slider is working. ");         }

    document.getElementById("Controls").onclick = function(event) { //Menu code
        switch(event.target.index) {
            case 0:
                console.log("Menu working 0");
                direction = !direction;//same thing as pressing change direction button
                break;
            case 1:
                speed += 0.3; //adds 0.03 to speed value
                console.log("Menu working 1");
                console.log("Speed: ", theta);
        }
    }

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ){//moves trianle left on A/a press
            case 'A':
            case 'a':
                left += 0.2;
                right = 0;
                console.log("Slide to the left!");
                break;

            case 'd'://moves triangle right on D/d press
            case 'D':
                left = 0;
                right += 0.2;
                console.log("Slide to the right!");
                break;
        }
    }; 

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (direction == true) { //Button makes square change direction
        theta += 0.1 * speed;}
    else {
        theta -= 0.2 * speed;;}


//Square
    gl.useProgram(program);

    var bufferID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    

    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//Draws square




//Triangle
    gl.useProgram(programTriangle);

    if (left >0){ //moves the triangle left on key press. Starts at origin

        verticesTriangle = [//moves triangle left
        vec2(0-left, 1),
        vec2(0.2-left, 0.7), 
        vec2(-0.2-left, 0.7)
        ];

    }

    if (right > 0){//moves triangle right
        verticesTriangle = [
        vec2(0+right, 1),
        vec2(0.2+right, 0.7), 
        vec2(-0.2+right, 0.7)
        ];

    }

    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesTriangle), gl.STATIC_DRAW);

    var positionLoc2 = gl.getAttribLocation(programTriangle, "bPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    gl.drawArrays(gl.TRIANGLES, 0, verticesTriangle.length);

    requestAnimationFrame(render);

}
