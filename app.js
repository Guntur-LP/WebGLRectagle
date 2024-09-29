window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let currentColor = [1.0, 0.0, 0.0, 1.0]; // Default color is red

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program
    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get uniform location for color
    const colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    // Buffer for circle vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Circle vertices
    const positions = createCircleVertices(0, 0, 0.5, 50);  // Circle at (0,0) with radius 0.5
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Button event listeners for color change
    document.getElementById('red').onclick = () => { 
        currentColor = [1.0, 0.5, 0.0, 1.0]; // Change to orange
        drawScene(); 
    };

    document.getElementById('blue').onclick = () => { 
        currentColor = [0.0, 0.0, 1.0, 1.0]; // Change to blue
        drawScene(); 
    };

    document.getElementById('green').onclick = () => { 
        currentColor = [0.0, 1.0, 0.0, 1.0]; // Change to green
        drawScene(); 
    };

    document.getElementById('reset').onclick = () => { 
        currentColor = [1.0, 0.0, 0.0, 1.0]; // Reset to red
        drawScene(); 
    };

    // Function to draw the scene
    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgram);

        // Set the current color
        gl.uniform4fv(colorLocation, currentColor);

        // Draw the object (circle)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
    }

    // Draw the initial scene
    drawScene();
};

// Helper function to create a shader program
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

// Helper function to compile a shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Helper function to generate vertices for a circle
function createCircleVertices(centerX, centerY, radius, numSegments) {
    const vertices = [];
    const angleStep = (2 * Math.PI) / numSegments;
    vertices.push(centerX, centerY);  // Center of the circle

    for (let i = 0; i <= numSegments; i++) {
        const angle = i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        vertices.push(x, y);
    }

    return vertices;
}
