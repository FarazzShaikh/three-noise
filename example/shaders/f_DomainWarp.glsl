#include <common>
#define INNER_RADIUS 0.2
#define OUTER_RADIUS 0.85
#define MIX_RATE 0.8

uniform vec3 iResolution;
uniform float iTime;

const mat2 m = mat2(0.80, 0.60, -0.60, 0.80);

float noise(in vec2 p) {
  //
  return (perlin(p) * sin(p.x) * 6.0) + 0.35;
}

float fbm4(vec2 p) {
  vec4 fbmOpts = vec4(0.5, 2.0, 1.0, 5.0);
  return fbm(p * m, fbmOpts) / 0.96875;
}

float fbm6(vec2 p) {
  float f = 0.0;
  f += 0.500000 * (0.5 + 0.5 * noise(p));
  p = m * p * 2.02;
  f += 0.250000 * (0.5 + 0.5 * noise(p));
  p = m * p * 2.03;
  f += 0.125000 * (0.5 + 0.5 * noise(p));
  p = m * p * 2.01;
  f += 0.062500 * (0.5 + 0.5 * noise(p));
  p = m * p * 2.04;
  f += 0.031250 * (0.5 + 0.5 * noise(p));
  p = m * p * 2.01;
  f += 0.015625 * (0.5 + 0.5 * noise(p));
  return f;
}

vec2 fbm4_2(vec2 p) { return vec2(fbm4(p), fbm4(p + vec2(7.8))); }

vec2 fbm6_2(vec2 p) { return vec2(fbm6(p + vec2(16.8)), fbm6(p + vec2(11.5))); }

//====================================================================

float func(vec2 q, out vec4 ron) {
  q += 0.03 * sin(vec2(0.27, 0.23) * iTime + length(q) * vec2(4.1, 4.3));

  vec2 o = fbm4_2(0.9 * q);

  o += 0.04 * sin(vec2(0.12, 0.14) * iTime + length(o));

  vec2 n = fbm6_2(3.0 * o);

  ron = vec4(o, n);

  float f = 0.5 + 0.5 * fbm4(1.8 * q + 6.0 * n);

  return mix(f, f * f * f * 3.5, f * abs(n.x));
}

void main() {

  vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
  float e = 2.0 / iResolution.y;

  p *= 1.5;

  vec4 on = vec4(0.0);
  float f = func(p, on);

  vec3 col = vec3(0.0);
  col = mix(vec3(0.2, 0.1, 0.4), vec3(0.3, 0.05, 0.2), f);
  col = mix(col, vec3(0.9, 0.9, 0.9), dot(on.zw, on.zw));
  col = mix(col, vec3(0.4, 0.3, 0.3), 0.5 * on.y * on.y);
  col = mix(col, vec3(0.0, 0.2, 0.6),
            0.7 * smoothstep(1.2, 1.3, (on.z) + (on.w)));
  col = clamp(col * f * 1.7, 0.0, 1.0);

  // manual derivatives - better quality, but slower
  vec4 kk;
  vec3 nor = normalize(vec3(func(p + vec2(e, 0.0), kk) - f, 2.0 * e,
                            func(p + vec2(0.0, e), kk) - f));

  vec3 lig = normalize(vec3(0.9, 0.2, -0.4));
  float dif = clamp(0.3 + 0.7 * dot(nor, lig), 0.0, 1.0);
  vec3 lin = vec3(0.70, 0.90, 0.95) * (nor.y * 0.5 + 0.5) +
             vec3(0.15, 0.10, 0.05) * dif;
  col *= 1.2 * lin;
  col = 1.0 - col;
  col = 1.1 * col * col;

  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 center = vec2(iResolution.x / 2.0, iResolution.y / 2.0) / iResolution.xy;
  float dist = 1.0 - distance(uv, center);
  float vig = smoothstep(INNER_RADIUS, OUTER_RADIUS, dist);

  gl_FragColor = vec4(mix(col, col * vig, MIX_RATE), 1.0);
}