import initYoga from "yoga-wasm-web/asm";

// Initialize the ASM version of Yoga.
// This returns a Promise that resolves to the Yoga instance.
// We use top-level await which Bun supports.
const Yoga = await initYoga();

export default Yoga;
