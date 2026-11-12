uniform float time;
uniform float seedTime;
uniform float noiseX;
uniform float noiseY;
uniform float swayRate;
uniform float swayFrequency;
uniform float swayAmplitude;
uniform float rise;
uniform float edgeSoft;
uniform float baseWidth;
uniform float widthGrow;
uniform float fadeIn;
uniform float fadeOut;
uniform float densityLow;
uniform float densityHigh;
uniform float gain;
varying vec2 planeUv;
varying vec3 tint;
varying float seed;
float hash(vec2 point) { return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 point) {
  vec2 cell = floor(point), fraction = fract(point);
  fraction = fraction * fraction * (3.0 - 2.0 * fraction);
  return mix(mix(hash(cell), hash(cell + vec2(1, 0)), fraction.x), mix(hash(cell + vec2(0, 1)), hash(cell + 1.0), fraction.x), fraction.y);
}
float fractalNoise(vec2 point) { return noise(point) * 0.55 + noise(point * 2.1) * 0.3 + noise(point * 4.3) * 0.15; }
void main() {
  vec2 point = vec2((planeUv.x - 0.5) * 2.0, planeUv.y);
  float localTime = time + seed * seedTime;
  float density = fractalNoise(vec2(point.x * noiseX + sin(localTime * swayRate + point.y * swayFrequency) * swayAmplitude, point.y * noiseY - localTime * rise));
  float width = baseWidth + point.y * widthGrow;
  float shape = (1.0 - smoothstep(edgeSoft, 1.0, abs(point.x) / width)) * smoothstep(0.0, fadeIn, point.y) * (1.0 - smoothstep(fadeOut, 1.0, point.y));
  float visibility = smoothstep(densityLow, densityHigh, density) * shape;
  gl_FragColor = vec4(tint * visibility * gain, 1.0);
}
