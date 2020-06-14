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
uniform int useFakeLight;

uniform float iTime;

const float density = 0.005;
const float gradient = 1.5;

void main(void){
    //float y = mix(sin(iTime * 0.01) * 0.1 + position.y, position.y, position.y);
    vec4 worldPosition = transformationMatrix * vec4(position.x, position.y, position.z, 1.0);
    vec4 positionRelativeToCamera = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * positionRelativeToCamera;
    pass_textureCoords = textureCoords;
    
    vec3 actualNormal = normal;
    if(useFakeLight == 1){
        actualNormal = vec3(0.0, 1.0, 0.0);
    }
    
    surfaceNormal = (transformationMatrix * vec4(actualNormal, 0.0)).xyz;
    lightVector = lightPosition - worldPosition.xyz;
    cameraVector = (inverse(viewMatrix) * vec4(0.0,0.0,0.0,1.0)).xyz - worldPosition.xyz;
    
    float distance = length(positionRelativeToCamera.xyz);
    visibility = exp(-pow(distance*density, gradient));
    visibility = clamp(visibility, 0.0, 1.0);
}