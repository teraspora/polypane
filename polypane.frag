// Polypane a multi-pane shader - a fragment shader in OpenGL, built on shadertoy.com;
// Author: John Lynch (teraspora);
// Date: 24 SEP 2018.

const float HALF = 0.5;
const float PI = 3.141592654;
const float TWO_PI = 6.283185307;

const vec3 white =      vec3(1.,   1.,   1.  );
const vec3 black =      vec3(0.,   0.,   0.  );
const vec3 cyan =       vec3(0.0,  1.,   0.84);
const vec3 magenta =    vec3(1.0,  0.,   1.0 );
const vec3 blue =       vec3(0.0,  0.6,  0.84);
const vec3 gold =       vec3(1.0,  0.84, 0.66);
const vec3 orange =     vec3(1.0,  0.2,  0.0 );
const vec3 yellow =     vec3(1.0,  1.0,  0.0 );
const vec3 dark_blue =  vec3(0.0,  0.05, 0.15);
const vec3 crimson =    vec3(0.76, 0.0,  0.42);
    
vec3[] cols = vec3[](magenta, cyan, crimson, blue, orange, yellow);
int cl = cols.length();

float arg(vec2 z) {
    return atan(z.y, z.x);
}

vec2 polar(float r, float phi) {
    return vec2(r * cos(phi), r * sin(phi));
}

vec2 times(vec2 v, vec2 w) {
    return vec2(v.x * w.x - v.y * w.y, v.x * w.y + v.y * w.x);
}

vec2 rotate(vec2 v, float phi) {
    return times(v, polar(1.0, phi)) ;
}

// MAIN METHOD:

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {    
    
    // Set this var to the number of tiles acroos and down:
    float tileDim = 5.;
    float numTiles = tileDim * tileDim;
    
    // some shorter names:
    float fx = fragCoord.x;
    float fy = fragCoord.y;
    float resx = iResolution.x;
    float resy = iResolution.y;
    vec2 f = fragCoord.xy;
    vec2 hr = iResolution.xy / tileDim;
    
    // MUTABLE VARIABLES
    float scaleFactor = 1.0;
    
    // ===============================================================
    // the output vector giving the position the program needs to know!-
    vec2 pp = f;
    // Make numTiles sub-frames:
    vec2 n = vec2(float(int(f.x / resx * tileDim)), float(int(f.y / resy * tileDim)));
    
    float tile = numTiles -(n.y * tileDim + n.x) - 1.;  // start at 1 so we don't lose stuff when multiplying
    float toe = fract(tile / 2.) * 4. - 1.; // returns 1. if tile index odd, -1. if even;
    float tile2 = tile * tile;
    
    // shift back to the first tile if in any other tile:
    pp.x -= hr.x * n.x;
    pp.y -= hr.y * n.y;
    // normalise to [0, 1[, shift to make unit quad with origin in centre
    vec2 q = pp / hr - 0.5;     // normalise
    // then scale:
    q /= scaleFactor;
    // ===============================================================
    
    q *= 1.0 + sin(iTime / 20.) * tile / numTiles * toe;    
    q = rotate(q, iTime / 10. * toe);
    // control factors for changing colours
    float cmi = float((int(iTime / 640.)));
    int cm = int(mod(cmi + tile2 + 1., float(cl)));;
    int cn = int(mod(float(cm) + 1., float(cl)));
    vec3 col = mix(cols[cm], cols[cn], q.y);
    
    col.b = sin(mod(iTime  / 12., 1.0));
    
    float freq = 10. + float(int(sqrt(tile))) + 10. * sin(iTime / 100.);
    float rmin = 0.15;
    float rinc = 0.06;
    float k = 0.25 + 0.1 * sin(iTime) * sin(tile); // 
    // shift the tree:
    q.x += 0.2 * sin(iTime / 2.) * toe;
    q.x -= 0.2 * sin(iTime / 10.) * toe;
    
    float phi = sin(iTime / 2. + tile) * 0.2;
    q = rotate(q, phi);    
    // r has all the info to make fronds and splay them:
    float r = rmin + k * cos(atan(q.y, q.x) * freq + 40. * q.x  + 1.4 * toe);
    q = rotate(q, -phi);    
    q = rotate(q, phi * toe * 2.);    
      
    // make trunk wavy:
    float trunkAngle = 0.2 * toe;
    float trunkWaviness = tile;
    float barkRoughness = 0.002;
    float barkIndentation = 60.;
    float baseSize = -.19;    
       
    // make arms:
    col *= smoothstep(r, r + rinc, length(q));
    // and a trunk:
    r = 0.04 * tile / numTiles;
    r += barkRoughness * cos(barkIndentation * q.y);
    r += exp(baseSize * pp.y);
    
    col *= 1. - (1. - smoothstep(r, r+ 0.001, abs(q.x - trunkAngle * sin(trunkWaviness * q.y)))) 
              * (1. - smoothstep(0.0, 0.01, q.y));    
    
    // ===============================================================================

    // Make a border: 8px solid black; with line inset:
    float b = 6.;   // border width    
    vec3 borderInsetLineColour = white;
    
    // Make a line inset:
    if ((pp.x > b - 1. && pp.x <= b + 1.) || (pp.x > hr.x - b - 1. && pp.x < hr.x - b + 1.)) col = borderInsetLineColour;
    if ((pp.y > b - 1. && pp.y <= b + 1.) || (pp.y > hr.y - b - 1. && pp.y < hr.y - b + 1.)) col = borderInsetLineColour;
    
    // Now put a black border on top:
    col *= step(b, pp.x);
    col *= step(b, pp.y);
    col *= (1. - step(hr.x - b, pp.x));
    col *= (1. - step(hr.y - b, pp.y));    
    
    // and finally return the colour:
    fragColor = vec4(col, 1.0);
}