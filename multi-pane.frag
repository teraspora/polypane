// four-panes - a fragment shader in OpenGL, built on shadertoy.com;
// Author: John Lynch (teraspora);
// Date: 23 SEP 2018.

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
    
    // some shorter names:
    float fx = fragCoord.x;
    float fy = fragCoord.y;
    float resx = iResolution.x;
    float resy = iResolution.y;
    
    // MUTABLE VARIABLES
    float sign = 1.;
    float scaleFactor = 1.0;
    float s = 1.45 * sin(iTime / 8.);
    
    // ===============================================================
    //Make four sub-frames:
    vec2 f = fragCoord.xy;
    vec2 hr = 0.5 * iResolution.xy;
    // the output vector giving the position the program needs to know!-
    vec2 pp = f;
    ;
    // shift back to the first quadrant if in any other quadrant:
    pp.x -= hr.x * step(hr.x, f.x);
    pp.y -= hr.y * step(hr.y, f.y);
    // normalise to [0, 1[, shift to make unit quad with origin in centre
    // then scale
    vec2 q = pp / hr - 0.5;     // normalise
    
    float quadrant = 2. * step(hr.x, f.x) + step(hr.y, f.y);
    if (quadrant == 0. || quadrant == 2.) quadrant = 2. - quadrant;
    float q2 = quadrant * quadrant;
    
    scaleFactor = 1.0 + (4. - quadrant) / 3.;
    q /= scaleFactor;
    // ===============================================================
    vec2 qr1 = rotate(q, iTime / -16.  * TWO_PI);    // rotate before modding
    
    vec2 qr2 = mod(abs(qr1), sin(iTime / 6.));       // mod to get multiple copies
    vec2 qr3 = rotate(qr2, iTime * q2);    // rotate after modding, opp. way
    q = qr3;
    // use these various states of q for different effects!
    q=sin(q) * q;
    // control factors for changing colours
    float cmi = fract(iTime / 100.) * 4.;
    int cm = int(mod(float(cmi) + quadrant, float(cl)));;
    int cn = int(mod(float(cm) + 1., float(cl)));
    vec3 col = mix(cols[cm], cols[cn], sin(iTime / 128.) * q.y);
    
    col.b = sin(mod(iTime  / 12., 1.0));
    
    float freq = 10. * q2;   //64.0 * sin(iTime / 32.);
    float rmin = 0.01;
    float rinc = 0.01;
    float k = 0.4 * sin(iTime);
    // r has all the info to make fronds and splay them:
    float r = rmin + k * cos(atan(q.y, q.x) * freq + 20. * q.x  + 2.);
      
    // make trunk wavy:
    float barkWaviness = mod(iTime * 32., 100.0) * (4. - quadrant);
    float barkIndentation = 0.16 * q2;
    r += barkIndentation * cos(barkWaviness * q.y);
    // make base broad; using p as it runs from 0 to 1:
    r += exp(-64.0 * pp.y);
    
    
    // make arms:
    col *= smoothstep(r, r + rinc, length(q ));
    // and a trunk:
    r = 0.01;
    col *= 1. - (1. - smoothstep(r, r+ 0.001, abs(q.x))) 
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