uniform float time;
uniform float beatBase;
uniform float beatAmplitude;
uniform float beatRate;
uniform float corePower;
uniform float coreGain;
uniform float ringRadius;
uniform float ringSharp;
uniform float ringBase;
uniform float ringAmplitude;
uniform float ringSpokes;
uniform float ringSpin;
uniform float waveRate;
uniform float waveSharp;
uniform float waveGain;
varying vec2 centeredUv;
varying vec3 tint;
void main() {
  float radius = length(centeredUv);
  if (radius > 1.0) discard;
  float angle = atan(centeredUv.y, centeredUv.x);
  float beat = beatBase + beatAmplitude * sin(time * beatRate);
  float core = pow(1.0 - radius, corePower) * coreGain * beat;
  float ring = exp(-pow((radius - ringRadius) * ringSharp, 2.0)) * (ringBase + ringAmplitude * sin(angle * ringSpokes + time * ringSpin));
  float wave = exp(-pow((radius - fract(time * waveRate)) * waveSharp, 2.0)) * (1.0 - radius) * waveGain;
  gl_FragColor = vec4(tint * (core + ring + wave), 1.0);
}
