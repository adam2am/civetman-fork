<div align="center">
    <img src="https://user-images.githubusercontent.com/13007891/210392977-03a3b140-ec63-4ce9-b6e3-0a0f7cac6cbe.png" width="50%">
    <h1>Civetman</h1>
    <p>A fast, modern build tool for using <a href="https://civet.dev/">Civet</a> in any project.</p>
</div>

`civetman` provides a seamless developer experience for writing Civet code by handling compilation, watching for changes, and integrating cleanly with your existing tools and workflows.

## Why Civetman?

* **Works everywhere TypeScript works** – React, Node.js, Vite, Next.js, Astro, Solid … if it understands `.ts`/`.tsx`, it now understands Civet.
* **Ship faster** – eliminate the TypeScript boilerplate and let Civet's concise syntax flow straight into your existing tool-chain.
* **Zero-config integration** – drop it into any project, no webpack/tsconfig/rollup plugins required.
* **Clean repo** – generated files are hidden from the editor and Git by default, so your repo stays clean.
* **CI-ready** – deterministic builds, content-hash caching and parallel compilation keep your pipeline lean.

---

## Quick Start (⌚ < 30 seconds)

```bash
# 1 – Install
pnpm add -D civetman            # (or npm i -D / yarn add -D)

# 2 – Add scripts to package.json
npm pkg set scripts.dev="civetman dev"
npm pkg set scripts.build="civetman build"

# 3 – Run in dev-mode
pnpm dev                        # initial compile ➜ file-watcher
```
-   `civetman dev`: Use this for local development. It runs an initial build and then watches for file changes.
-   `civetman build`: Use this for production builds or in CI/CD environments. It performs a one-time compilation of all `.civet` files.
- It's recommended to add `civetman build` to the `postinstall` script to ensure `.ts` files are present after a fresh install.

Now create a file like `src/hello.civet` and start writing Civet – the corresponding `hello.ts` (or `hello.tsx`) appears automatically and your app just works.

---

## Key Features

-   **Watch Mode**: The `dev` command watches your files and recompiles them instantly on change.
-   **IDE & Git Integration**: Automatically hides generated files in VS Code and adds them to `.gitignore` for a clutter-free workspace.
-   **Source Maps**: Generates source maps for easy debugging.
-   **Fast, Incremental Builds**: Caches build artifacts and only recompiles what's necessary.
-   **Parallel Processing**: Uses a worker pool to compile multiple files in parallel, leveraging all your CPU cores.
-   **Flexible Configuration**: Fine-tune output directories, file types (`.ts` vs `.tsx`), and more.

## How It Works

`civetman` compiles every `.civet` file into a corresponding `.ts` or `.tsx` file. This "shadow file" approach means that the rest of your toolchain (like Vite, Next.js, Jest, or the TypeScript compiler) doesn't need to know about Civet at all—it just sees standard TypeScript files.

To keep your project clean, `civetman` performs two "hygiene" tasks:
1.  It adds the generated output files (e.g., `*.ts`, `*.tsx`, `*.map` (if map is on)) to your `.gitignore` file.
2.  It adds the same files to `files.exclude` in your `.vscode/settings.json`, hiding them from the VS Code file explorer.

## CLI Documentation

```
Usage: civetman [options] [command]

Use Civet language in any project – build or watch .civet files

Options:
  -V, --version                   output the version number
  -x, --tsx                       Generate .tsx files instead of .ts (default: false)
  --out-ts <dir>                  Directory to emit .ts files (repeatable or comma-separated)
  --out-tsx <dir>                 Directory to emit .tsx files (repeatable or comma-separated)
  --ignore-folders <dir>          Folder(s) to ignore (repeatable or comma-separated)
  --no-git-ignore                 Disable writing generated files to .gitignore
  --no-vscode-hide                Disable hiding generated files in VS Code
  --inline-map <mode>             Inline source map mode (choices: "full", "fileurl", "none", default: "full")
  --map-files                     Emit external .map files (default: false)
  --concurrency <number>          Max parallel compilations
  --force-polling                 Force chokidar polling even outside CI (default: false)
  -h, --help                      display help for command

Commands:
  build                           One-shot compile of all .civet files
  dev                             Watch .civet files and rebuild on change
  help [command]                  display help for command
```

### Examples

You can specify different output directories for `.ts` and `.tsx` files. This is useful for separating component files from business logic.

```bash
# Compile files in `src/components` to .tsx and everything else to .ts
civetman build --out-tsx src/components --out-ts src
```

## Examples

Several examples are available in the `examples` directory of this repository:

-   [Basic example](https://github.com/adam2am/civetman-fork/tree/main/examples/basic)
-   [Vanilla Extract example](https://github.com/adam2am/civetman-fork/tree/main/examples/astro-vanilla-extract)
-   [Solid component library example](https://github.com/adam2am/civetman-fork/tree/main/examples/solid-component-lib)

