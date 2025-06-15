import { defineConfig, type PluginOption, build as viteBuild } from "vite"
import Civet from "vite-plugin-civet"
import { builtinModules } from "node:module"

// Custom plugin to build the worker script as a separate asset after the main build.
function buildWorker(): PluginOption {
	return {
		name: 'build-worker',
		apply: 'build',
		enforce: 'post',
		async writeBundle() {
			await viteBuild({
				configFile: false,
				publicDir: false,
				build: {
					outDir: 'dist/workers',
					target: 'node18',
					ssr: true,
					minify: false,
					lib: {
						entry: 'src/workers/compileWorker.civet',
						formats: ['cjs'],
						fileName: 'compileWorker',
					},
					rollupOptions: {
						external: ['@danielx/civet', 'node:fs/promises', 'node:worker_threads']
					}
				},
				plugins: [Civet() as PluginOption],
			})
		}
	}
}

export default defineConfig({
	build: {
		lib: {
			entry: {
				'index': './index.ts',
			},
			formats: ["es"],
			fileName: () => 'index.js'
		},
		target: "node18",
		ssr: true,
		minify: false,
		rollupOptions: {
			external: [
				...builtinModules,
				...builtinModules.map((m) => `node:${m}`),
				"picocolors",
				"commander",
				"fs-extra",
				"fast-glob",
				"@danielx/civet",
				"chokidar",
				"ora",
			],
		},
	},
	plugins: [Civet() as PluginOption, buildWorker()],
}) 