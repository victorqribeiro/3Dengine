#version 300 es

in vec3 position;
out vec3 textureCoords;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main(void){
	mat4 m =  viewMatrix;
    m[3][0] = 0.0;
    m[3][1] = 0.0;
    m[3][2] = 0.0;
	gl_Position = projectionMatrix * m * vec4(position, 1.0); 
	textureCoords = position;
	
}
