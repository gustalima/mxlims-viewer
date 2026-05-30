import babel from '@rolldown/plugin-babel'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig(({ command }) => ({
    root: resolve(__dirname),
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset({ target: '19' })] } as any),
        checker({
            typescript:
                command === 'build' ? false : (
                    {
                        root: './',
                        tsconfigPath: 'tsconfig.json',
                    }
                ),
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },

    build: {
        sourcemap: true,
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
    },
    server: {
        watch: {
            ignored: ['**/*.jsx', '**/*.nfs'],
        },
    },
}))
