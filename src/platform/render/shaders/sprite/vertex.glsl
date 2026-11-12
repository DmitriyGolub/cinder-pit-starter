attribute vec3 instancePosition;
attribute vec4 instanceRect;
attribute vec4 instanceUv;
attribute float instanceLight;
attribute vec4 instanceTint;
attribute float instanceRotation;
uniform vec3 cameraRight;
varying vec2 atlasUv;
varying float light;
varying vec4 tint;
varying float depth;
void main() {
  vec2 local = instanceRect.xy + position.xy * instanceRect.zw;
  vec2 center = instanceRect.xy + 0.5 * instanceRect.zw;
  float cosine = cos(instanceRotation);
  float sine = sin(instanceRotation);
  local = center + mat2(cosine, sine, -sine, cosine) * (local - center);
  vec3 worldPosition = instancePosition + cameraRight * local.x + vec3(0.0, local.y, 0.0);
  atlasUv = instanceUv.xy + position.xy * instanceUv.zw;
  light = instanceLight;
  tint = instanceTint;
  vec4 viewPosition = viewMatrix * vec4(worldPosition, 1.0);
  depth = -viewPosition.z;
  gl_Position = projectionMatrix * viewPosition;
}
