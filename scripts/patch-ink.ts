import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const inkBuildPath = join(process.cwd(), 'node_modules', 'ink', 'build');

function patchDirectory(dir: string) {
    const files = readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const stats = statSync(filePath);

        if (stats.isDirectory()) {
            patchDirectory(filePath);
            continue;
        }

        if (!file.endsWith('.js')) continue;

        const content = readFileSync(filePath, 'utf-8');

        if (content.includes("from 'yoga-wasm-web/auto'")) {
            console.log(`Patching ${file}...`);
            // We need to point to our shim which initializes the ASM version correctly
            // The path needs to be relative to the file in node_modules/ink/build/
            // node_modules/ink/build/ -> ../../../src/yoga-shim.ts
            const newContent = content.replace(/from 'yoga-wasm-web\/auto'/g, "from '../../../src/yoga-shim.ts'");
            writeFileSync(filePath, newContent);
        } else if (content.includes("from 'yoga-wasm-web/asm'")) {
            // If previously patched to asm directly (which failed), re-patch to shim
            console.log(`Re-patching ${file} from asm to shim...`);
            const newContent = content.replace(/from 'yoga-wasm-web\/asm'/g, "from '../../../src/yoga-shim.ts'");
            writeFileSync(filePath, newContent);
        }
    }
}

console.log('Scanning for ink files to patch...');
try {
    patchDirectory(inkBuildPath);
    console.log('✅ Successfully patched all ink files to use yoga-wasm-web/asm');
} catch (error) {
    console.error('Error patching ink:', error);
    process.exit(1);
}
