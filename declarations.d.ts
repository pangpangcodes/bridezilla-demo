// Ambient module declarations for packages without bundled types

// pdf-parse internal path used to avoid the test-file ENOENT bug in the main entry point
declare module 'pdf-parse/lib/pdf-parse.js' {
  function pdfParse(
    dataBuffer: Buffer,
    options?: { max?: number; version?: string }
  ): Promise<{
    text: string
    numpages: number
    info: Record<string, any>
    metadata: any
    version: string
  }>
  export default pdfParse
}
