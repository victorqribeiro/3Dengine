precision highp float;

#define BLADE_SEGS 4.0 // # of blade segments
#define BLADE_DIVS (BLADE_SEGS + 1.0)  // # of divisions
#define BLADE_VERTS (BLADE_DIVS * 2.0) // # of vertices (per side, so 1/2 total)

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float patchSize; // size of grass square area (width & height)
uniform vec2 drawPos; // centre of where we want to draw
uniform float time;  // used to animate blades
attribute float vindex; // Which vertex are we drawing - the main thing we need to know
attribute vec4 offset; // {x:x, y:y, z:z, w:rot} (blade's position & rotation)
attribute vec4 shape; // {x:width, y:height, z:lean, w:curve} (blade's shape properties)
varying vec4 vColor;
varying vec2 vUv;

vec2 rotate (float x, float y, float r) {
	float c = cos(r);
	float s = sin(r);
	return vec2(x * c - y * s, x * s + y * c);
}

void main() {
	float vi = mod(vindex, BLADE_VERTS); // vertex index for this side of the blade
	float di = floor(vi / 2.0);  // div index (0 .. BLADE_DIVS)
	float hpct = di / BLADE_SEGS;  // percent of height of blade this vertex is at
	float bside = floor(vindex / BLADE_VERTS);  // front/back side of blade
	float xside = mod(vi, 2.0);  // left/right edge (x=0 or x=1)
	float x = shape.x * (xside - 0.5) * (1.0 - pow(hpct, 3.0)); // taper blade as approach tip
	// apply blade's natural curve amount, then apply animated curve amount by time
	float curve = shape.w + 0.4 * (sin(time * 4.0 + offset.x * 0.8) + cos(time * 4.0 + offset.y * 0.8));
	float y = shape.z * hpct + curve * (hpct * hpct); // pow(hpct, 2.0);
	// based on centre of view cone position, what grid tile should
	// this piece of grass be drawn at?
	vec2 gridOffset = vec2(
		floor((drawPos.x - offset.x) / patchSize) * patchSize + patchSize / 2.0,
		floor((drawPos.y - offset.y) / patchSize) * patchSize + patchSize / 2.0
	);
	// rotate this blade vertex by this blade's rotation
	vec4 pos = vec4(
		rotate(x, y, offset.w),
		shape.y * di / BLADE_SEGS + offset.z,
		1.0
	);
	// move to grid position and then to blade position
	pos.x += gridOffset.x + offset.x;
	pos.y += gridOffset.y + offset.y;
	// grass texture coordinate for this vertex
	vec2 uv = vec2(xside, di * 2.0);
	// cheap lighting for now - light based on rotation angle of blade
	// and depending on which side of the blade this vertex is on
	// and depending on how high up the blade we are
	// TODO: calculate normal?
	float c = max(cos(offset.w + bside * 3.14159) - (1.0 - hpct) * 0.4, 0.0);
	c = 0.3 + 0.7 * c * c * c;
	// outputs
	vColor = vec4(
		c * 0.85 + cos(offset.x * 80.0) * 0.05,
		c + sin(offset.y * 140.0) * 0.05,
		c + sin(offset.x * 99.0) * 0.05,
		1.0
	);
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * pos;
}
