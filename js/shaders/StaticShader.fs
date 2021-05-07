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
uniform sampler2D textureSampler;
uniform vec3 lightColor;
uniform float shineDamper;
uniform float reflectivity;
uniform vec3 skyColor;

void main(void){
    vec3 nLightVector = normalize(lightVector);
    vec3 nSurfaceNormal = normalize(surfaceNormal);
    float brightness = max(dot(nSurfaceNormal, nLightVector),0.2);
    vec4 diffuse = vec4(brightness * lightColor,1.0);
    vec3 lightDirection = -nLightVector;
    vec3 reflectedLightDirection = reflect(nLightVector,nSurfaceNormal);
    float specularFactor = max(dot(reflectedLightDirection, normalize(cameraVector)),0.0);
    float dampedFactor = pow(specularFactor, shineDamper);
    vec3 finalSpecular = dampedFactor * reflectivity * lightColor;
    
    vec4 textureColor = texture(textureSampler, pass_textureCoords);
    
    if(textureColor.a < 0.9){
        discard;
    }
    //vec2 uv = gl_FragCoord.xy / iResolution.xy;
    //float c = iMouse.x / gl_FragCoord.x;
    out_color = diffuse * textureColor + vec4(finalSpecular, 1.0);
    out_color = mix(vec4(skyColor,1.0),out_color, visibility);
    //out_color *= vec4(uv.x, c, uv.y, 1.0);
    
    //float gray = out_color.r * 0.2126 + out_color.g * 0.7152 + out_color.b * 0.0722;
    //out_color = vec4(gray, gray, gray, 1.0);
}
