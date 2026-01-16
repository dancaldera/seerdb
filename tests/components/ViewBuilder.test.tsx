import { describe, expect, it } from "bun:test";
import { Text } from "ink";
import { render } from "ink-testing-library";
import React from "react";
import { ViewBuilder } from "../../src/components/ViewBuilder.js";

describe("ViewBuilder", () => {
	it("renders title correctly", () => {
		const { lastFrame } = render(
			<ViewBuilder title="Test Title">
				<Text>Content</Text>
			</ViewBuilder>,
		);

		expect(lastFrame()).toContain("Test Title");
	});

	it("renders subtitle when provided", () => {
		const { lastFrame } = render(
			<ViewBuilder title="Title" subtitle="Test Subtitle">
				<Text>Content</Text>
			</ViewBuilder>,
		);

		expect(lastFrame()).toContain("Test Subtitle");
	});

	it("renders children content", () => {
		const { lastFrame } = render(
			<ViewBuilder title="Title">
				<Text>Hello World</Text>
			</ViewBuilder>,
		);

		expect(lastFrame()).toContain("Hello World");
	});

	it("renders footer when provided", () => {
		const { lastFrame } = render(
			<ViewBuilder title="Title" footer="Press ESC to exit">
				<Text>Content</Text>
			</ViewBuilder>,
		);

		expect(lastFrame()).toContain("Press ESC to exit");
	});

	it("renders without subtitle or footer", () => {
		const { lastFrame } = render(
			<ViewBuilder title="Minimal Title">
				<Text>Minimal Content</Text>
			</ViewBuilder>,
		);

		expect(lastFrame()).toContain("Minimal Title");
		expect(lastFrame()).toContain("Minimal Content");
	});

	it("renders all props together", () => {
		const { lastFrame } = render(
			<ViewBuilder
				title="Full Title"
				subtitle="Full Subtitle"
				footer="Full Footer"
			>
				<Text>Full Content</Text>
			</ViewBuilder>,
		);

		const frame = lastFrame();
		expect(frame).toContain("Full Title");
		expect(frame).toContain("Full Subtitle");
		expect(frame).toContain("Full Content");
		expect(frame).toContain("Full Footer");
	});
});
