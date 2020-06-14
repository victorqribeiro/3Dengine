precision highp float;

uniform sampler2D map;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform vec3 grassFogColor;
uniform float grassFogFar;
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

void main() {
	vec4 color = vec4(vColor) * texture2D(map, vec2(vUv.s, vUv.t));
	float depth = gl_FragCoord.z / gl_FragCoord.w;
	// apply 'grass fog' first
	float fogFactor = smoothstep(fogNear, grassFogFar, depth);
	color.rgb = mix(color.rgb, grassFogColor, fogFactor);
	// then apply atmosphere fog
	fogFactor = smoothstep(fogNear, fogFar, depth);
	color.rgb = mix(color.rgb, fogColor, fogFactor);
	// output
	gl_FragColor = color;
}
