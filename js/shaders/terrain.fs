#version 300 es

precision highp float;

in vec2 pass_textureCoords;
in vec3 surfaceNormal;
in vec3 lightVector;
in vec3 cameraVector;
in float visibility;
out vec4 out_color;

uniform vec3 iResolution;
uniform vec2 iMouse;

uniform sampler2D backgroundTexture;
uniform sampler2D rTexture;
uniform sampler2D gTexture;
uniform sampler2D bTexture;
uniform sampler2D blendMap;

uniform vec3 lightColor;
uniform float shineDamper;
uniform float reflectivity;
uniform vec3 skyColor;

void main(void){

    vec4 blendMapColor = texture(blendMap, pass_textureCoords);
    
    float backTextureAmount = 1.0 - (blendMapColor.r + blendMapColor.g + blendMapColor.b);
    vec2 tiledCoords = pass_textureCoords * 100.0;
    vec4 backgroundTextureColor = texture(backgroundTexture, tiledCoords) * backTextureAmount;
    vec4 rTextureColor = texture(rTexture, tiledCoords) * blendMapColor.r;
    vec4 gTextureColor = texture(gTexture, tiledCoords) * blendMapColor.g;
    vec4 bTextureColor = texture(bTexture, tiledCoords) * blendMapColor.b;
    
    vec4 totalColor = backgroundTextureColor + rTextureColor + gTextureColor + bTextureColor;

    vec3 nLightVector = normalize(lightVector);
    vec3 nSurfaceNormal = normalize(surfaceNormal);
    float brightness = max(dot(nSurfaceNormal, nLightVector),0.2);
    vec4 diffuse = vec4(brightness * lightColor,1.0);
    vec3 lightDirection = -nLightVector;
    vec3 reflectedLightDirection = reflect(nLightVector,nSurfaceNormal);
    float specularFactor = max(dot(reflectedLightDirection, normalize(cameraVector)),0.0);
    float dampedFactor = pow(specularFactor, shineDamper);
    vec3 finalSpecular = dampedFactor * reflectivity * lightColor;

    out_color = diffuse * totalColor + vec4(finalSpecular, 1.0);
    out_color = mix(vec4(skyColor,1.0),out_color, visibility);

}
