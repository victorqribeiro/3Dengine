#version 300 es

precision highp float;

in vec3 textureCoords;
out vec4 out_Color;

uniform samplerCube cubeMap;
uniform vec3 fogColor;

const float lowerLimit = 0.0;
const float upperLimit = 30.0;

void main(void){
    vec4 finalColor = texture(cubeMap, textureCoords);
    float factor = clamp((textureCoords.y - lowerLimit) / (upperLimit - lowerLimit),0.0,1.0);
    out_Color = mix(vec4(fogColor, 1.0), finalColor, factor);
    out_Color = finalColor;
}
