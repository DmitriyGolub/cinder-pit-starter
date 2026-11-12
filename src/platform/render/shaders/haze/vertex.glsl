uniform vec2 size;
varying vec2 planeUv;
varying vec3 tint;
varying float seed;
void main() {
  planeUv = uv;
  tint = vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
  tint = instanceColor;
  #endif
  vec3 center = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  seed = fract(sin(dot(center.xz, vec2(12.9898, 78.233))) * 43758.5453);
  vec4 viewPosition = viewMatrix * vec4(center, 1.0);
  viewPosition.xy += vec2(position.x * size.x, (position.y + 0.5) * size.y);
  gl_Position = projectionMatrix * viewPosition;
}
