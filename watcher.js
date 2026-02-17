const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Configuration
const WATCH_DIRS = ['js', 'css'];
const EXTENSIONS = ['.js', '.css'];
const IGNORE_SUFFIX = '.min';
const DEBOUNCE_MS = 500;

let debounceTimer = null;

// Helper to run shell commands
function runCommand(command) {
    console.log(`\n[Watcher] Executing: ${command}`);
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`[Watcher] Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`[Watcher] Stderr: ${stderr}`);
        }
        console.log(`[Watcher] Success! output:\n${stdout}`);
    });
}

// Watch function
function watchDirectory(dir) {
    console.log(`[Watcher] Watching directory: ${dir}`);
    
    fs.watch(dir, (eventType, filename) => {
        if (!filename) return;

        const ext = path.extname(filename);
        const name = path.basename(filename, ext);

        // Filter valid extensions
        if (!EXTENSIONS.includes(ext)) return;

        // Ignore minified files to prevent loops
        if (name.endsWith(IGNORE_SUFFIX)) return;

        console.log(`[Watcher] File changed: ${filename}`);

        // Debounce execution
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            if (ext === '.js') {
                runCommand('npm run minify:js');
            } else if (ext === '.css') {
                runCommand('npm run minify:css');
            }
        }, DEBOUNCE_MS);
    });
}

// Initialize watchers
WATCH_DIRS.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        watchDirectory(fullPath);
    } else {
        console.warn(`[Watcher] Directory not found: ${fullPath}`);
    }
});

console.log('[Watcher] Started. Press Ctrl+C to stop.');
