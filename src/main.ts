import './style.css';
import {setupBasicTriangle} from "./basic-triangle";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("webgpu") as GPUCanvasContext;

const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
	throw Error('Couldn\'t request WebGPU adapter.');
}
const device = await adapter.requestDevice();

const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
ctx.configure({
	device,
	format: presentationFormat,
	alphaMode: 'premultiplied',
});

// Basic Triangle
const triangleBundle = await setupBasicTriangle(device, presentationFormat);

async function frame() {
	console.time("frame");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const encoder = device.createCommandEncoder();

	const renderPass = encoder.beginRenderPass({
		colorAttachments: [{
			loadOp: 'clear',
			storeOp: 'store',
			clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
			view: ctx.getCurrentTexture().createView()
		}]
	});
	renderPass.executeBundles([triangleBundle]);
	renderPass.end();

	device.queue.submit([encoder.finish()]);

	await device.queue.onSubmittedWorkDone();
	console.timeEnd("frame");
	requestAnimationFrame(frame);
}

requestAnimationFrame(frame);