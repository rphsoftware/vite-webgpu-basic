struct V2F {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f
}


@vertex
fn vs_main(
    @location(0) position: vec2f,
    @location(1) color: vec3f
) -> V2F {
    var output: V2F;
    output.position = vec4f(position, 0.0, 1.0);
    output.color = color;

    return output;
}

@fragment
fn fs_main(
    data: V2F
) -> @location(0) vec4f {
    return vec4f(data.color, 1.0);
}