uniform sampler2D map;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float alphaCutoff;
uniform float tintGain;
uniform vec3 luma;
varying vec2 atlasUv;
varying float light;
varying float depth;
varying vec4 tint;
void main() {
  vec4 texel = texture2D(map, atlasUv);
  if (texel.a < alphaCutoff) discard;
  float luminance = dot(texel.rgb, luma);
  texel.rgb = mix(texel.rgb, tint.rgb * luminance * tintGain, tint.a);
  float fog = smoothstep(fogNear, fogFar, depth);
  gl_FragColor = vec4(mix(texel.rgb * light, fogColor, fog), 1.0);
  #include <colorspace_fragment>
}
