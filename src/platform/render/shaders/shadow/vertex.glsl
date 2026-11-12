varying vec2 centeredUv;
varying float depth;
void main() {
  centeredUv = uv * 2.0 - 1.0;
  vec4 viewPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  depth = -viewPosition.z;
  gl_Position = projectionMatrix * viewPosition;
}
