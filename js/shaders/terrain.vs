#version 300 es

in vec3 position;
in vec2 textureCoords;
in vec3 normal;
out vec2 pass_textureCoords;
out vec3 surfaceNormal;
out vec3 lightVector;
out vec3 cameraVector;
out float visibility;

uniform mat4 transformationMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform vec3 lightPosition;

const float density = 0.007;
const float gradient = 1.5;

void main(void){
    vec4 worldPosition = transformationMatrix * vec4(position, 1.0);
    vec4 positionRelativeToCamera = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * positionRelativeToCamera;
    pass_textureCoords = textureCoords;
    surfaceNormal = (transformationMatrix * vec4(normal, 0.0)).xyz;
    lightVector = lightPosition - worldPosition.xyz;
    cameraVector = (inverse(viewMatrix) * vec4(0.0,0.0,0.0,1.0)).xyz - worldPosition.xyz;
    
    float distance = length(positionRelativeToCamera.xyz);
    visibility = exp(-pow(distance*density, gradient));
    visibility = clamp(visibility, 0.0, 1.0);
}
