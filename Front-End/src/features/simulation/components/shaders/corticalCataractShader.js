const CorticalCataractShader = {

  uniforms: {
    tDiffuse: { value: null },
    severity: { value: 0.5 },
    resolution: { value: null }
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
    }
  `,
fragmentShader: `
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float severity;
uniform vec2 resolution;

vec3 blur9(
    sampler2D image,
    vec2 uv,
    vec2 res,
    float radius
){
    vec2 off = vec2(
        radius / max(res.x, 1.0),
        radius / max(res.y, 1.0)
    );

    vec3 color = vec3(0.0);

    color += texture2D(image, uv).rgb * 4.0;

    color += texture2D(image, uv + vec2( off.x, 0.0)).rgb;
    color += texture2D(image, uv + vec2(-off.x, 0.0)).rgb;
    color += texture2D(image, uv + vec2(0.0,  off.y)).rgb;
    color += texture2D(image, uv + vec2(0.0, -off.y)).rgb;

    color += texture2D(image, uv + off).rgb;
    color += texture2D(image, uv - off).rgb;

    color += texture2D(image, uv + vec2( off.x,-off.y)).rgb;
    color += texture2D(image, uv + vec2(-off.x, off.y)).rgb;

    return color / 12.0;
}

float corticalSpokes(vec2 uv)
{
    vec2 p = uv - vec2(0.5);

    float angle = atan(
        p.y + 0.00001,
        p.x + 0.00001
    );

    float radius = length(p);

    float spoke1 =
        pow(abs(cos(angle * 6.0)), 18.0);

    float spoke2 =
        pow(abs(cos(angle * 9.0 + 0.8)), 22.0);

    float peripheral =
        smoothstep(
            0.35,
            0.85,
            radius
        );

    return max(spoke1, spoke2) * peripheral;
}

void main()
{
    vec3 original =
        texture2D(
            tDiffuse,
            vUv
        ).rgb;

    vec2 p = vUv - vec2(0.5);
    float radius = length(p);

    float spokes =
        corticalSpokes(vUv);

    vec3 blurSmall =
        blur9(
            tDiffuse,
            vUv,
            resolution,
            mix(
                0.3,
                4.0,
                severity
            )
        );

    vec3 blurLarge =
        blur9(
            tDiffuse,
            vUv,
            resolution,
            mix(
                1.0,
                12.0,
                severity
            )
        );

    vec3 color = original;

    color =
        mix(
            color,
            blurSmall,
            severity * 0.25
        );

    color =
        mix(
            color,
            blurLarge,
            spokes * severity * 0.65
        );

    float peripheralHaze =
        smoothstep(
            0.45,
            0.9,
            radius
        );

    color =
        mix(
            color,
            vec3(1.0),
            peripheralHaze *
            severity *
            0.08
        );

    float lum =
        dot(
            original,
            vec3(0.299, 0.587, 0.114)
        );

    float glare =
        smoothstep(
            0.65,
            1.0,
            lum
        );

    vec3 bloom =
        blur9(
            tDiffuse,
            vUv,
            resolution,
            18.0
        );

    color +=
        bloom *
        glare *
        severity *
        0.55;

    float star =
        pow(
            abs(p.x * p.y),
            0.15
        );

    color +=
        vec3(1.0) *
        glare *
        star *
        severity *
        0.15;

    float gray =
        dot(
            color,
            vec3(
                0.299,
                0.587,
                0.114
            )
        );

    color =
        mix(
            vec3(gray),
            color,
            1.0 - severity * 0.25
        );

    color =
        mix(
            vec3(0.5),
            color,
            1.0 - severity * 0.10
        );

    gl_FragColor =
        vec4(color, 1.0);
}
`
};

export default CorticalCataractShader;