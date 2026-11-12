varying vec2 centeredUv;
varying vec3 tint;
void main() {
  centeredUv = uv * 2.0 - 1.0;
  tint = vec3(1.0);
  #ifdef USE_INSTANCING_COLOR
  tint = instanceColor;
  #endif
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
}
