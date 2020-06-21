#version 300 es

in vec3 position;
out vec3 textureCoords;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform float iTime;

void main(void){
	mat4 m =  viewMatrix;
    m[3][0] = 0.0;
    m[3][1] = 0.0;
    m[3][2] = 0.0;
    float a = iTime * 0.00001;
    mat4 rotation = mat4(
        cos(a), 0.0, sin(a), 0.0,
        0.0, 1.0, 0.0, 0.0,
        -sin(a), 0.0, cos(a), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    m *= rotation;
	gl_Position = projectionMatrix * m * vec4(position, 1.0); 
	textureCoords = position;
	
}
