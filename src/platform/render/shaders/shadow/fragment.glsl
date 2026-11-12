uniform float strength;
uniform float softness;
uniform float fogNear;
uniform float fogFar;
varying vec2 centeredUv;
varying float depth;
void main() {
  float radius = length(centeredUv);
  if (radius > 1.0) discard;
  float shade = 1.0 - smoothstep(1.0 - softness, 1.0, radius);
  float fog = smoothstep(fogNear, fogFar, depth);
  gl_FragColor = vec4(0.0, 0.0, 0.0, shade * strength * (1.0 - fog));
}
