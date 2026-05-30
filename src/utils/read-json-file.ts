/**
 * Read a File object and parse it as JSON.
 * Calls `onFile(parsed)` on success or `onFile(null)` on parse error.
 */
export function readJsonFile(file: File, onFile: (raw: unknown) => void): void {
    const reader = new FileReader()
    reader.onload = (ev) => {
        try {
            const parsed = JSON.parse(ev.target?.result as string) as unknown
            onFile(parsed)
        } catch {
            onFile(null)
        }
    }
    reader.readAsText(file)
}
