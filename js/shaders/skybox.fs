#version 300 es

precision highp float;

in vec3 textureCoords;
out vec4 out_color;

uniform samplerCube cubeMap;
uniform vec3 fogColor;

const float lowerLimit = 0.0;
const float upperLimit = 30.0;

void main(void){
    vec4 finalColor = texture(cubeMap, textureCoords);
    float factor = clamp((textureCoords.y - lowerLimit) / (upperLimit - lowerLimit),0.0,1.0);
    out_color = mix(vec4(fogColor, 1.0), finalColor, factor);
    out_color = finalColor;
    
    //float gray = out_color.r * 0.2126 + out_color.g * 0.7152 + out_color.b * 0.0722;
    //out_color = vec4(gray, gray, gray, 1.0);
}
