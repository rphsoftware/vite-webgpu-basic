export async function setupBasicTriangle(device: GPUDevice, presentationFormat: GPUTextureFormat) {
	const basicTriangle_vertices= new Float32Array([
		/* vec2f - Vertex Position, vec3f - Color */
		-0.5, -0.5, 1.0, 0.0, 0.0,
		0.0, 0.5, 0.0, 1.0, 0.0,
		0.5, -0.5, 0.0, 0.0, 1.0,
	]);

	const basicTriangle_shader = device.createShaderModule({
		code: await fetch("./wgsl/basic_triangle.wgsl").then(res => res.text())
	});

	const basicTriangle_vertexBuffer = device.createBuffer({
		size: basicTriangle_vertices.byteLength,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(basicTriangle_vertexBuffer, 0, basicTriangle_vertices);

	const basicTriangle_pipeline = device.createRenderPipeline({
		vertex: {
			module: basicTriangle_shader,
			entryPoint: "vs_main",
			buffers: [
				{
					attributes: [
						{
							shaderLocation: 0,
							offset: 0,
							format: "float32x2"
						},
						{
							shaderLocation: 1,
							offset: 8,
							format: "float32x3"
						}
					],
					arrayStride: 20,
					stepMode: "vertex"
				}
			]
		},
		fragment: {
			module: basicTriangle_shader,
			entryPoint: "fs_main",
			targets: [
				{
					format: presentationFormat
				}
			]
		},
		primitive: {
			topology: "triangle-strip",
		},
		layout: "auto"
	});

	const render_bundle = device.createRenderBundleEncoder({
		colorFormats: [presentationFormat]
	});

	render_bundle.setPipeline(basicTriangle_pipeline);
	render_bundle.setVertexBuffer(0, basicTriangle_vertexBuffer);
	render_bundle.draw(3, 1, 0, 0);

	return render_bundle.finish();
}