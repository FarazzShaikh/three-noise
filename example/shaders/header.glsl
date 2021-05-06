

uniform float dt;

// the function which defines the displacement
vec3 GerstnerWave(vec3 point, vec4 wave, float time) {

  float steepness = wave.z;
  float wavelength = wave.w;

  float x = point.x;
  float y = point.y;
  float z = point.z;

  float k = 2.0 * PI / wavelength; // scale
  float c = sqrt(9.8 / k);
  vec2 d = normalize(wave.xy);
  float f = k * (dot(d, vec2(x, z)) - (c * time));
  float a = steepness / k;

  return vec3((d.x * (a * cos(f))), a * sin(f), (d.y * (a * cos(f))));
}

vec3 displace(vec3 p) {
  vec3 result = p;

  float time = (dt / 10000.0);

  vec4 wave1 = vec4(1.0, 1.0, 0.25, 0.6);
  vec4 wave2 = vec4(0.2, 0.6, 0.25, 0.3);
  vec4 wave3 = vec4(0.3, 0.3, 0.25, 0.2);
  vec4 wave4 = vec4(1.0, 0.0, 0.1, 0.2);

  vec4 opts = vec4(0.5, 2.0, 1.0, 5.0);
  result.y += fbm(p.xz * 5.0, opts) * 0.02;
  result += GerstnerWave(p, wave1, time);
  result += GerstnerWave(p, wave2, time);
  result += GerstnerWave(p, wave3, time);
  result += GerstnerWave(p, wave4, time);

  return result;
}

vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}
