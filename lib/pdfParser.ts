/**
 * PDF Parser Utility
 * Extracts text content from uploaded PDF files for AI parsing
 */

export interface PDFParseResult {
  text: string
  numPages: number
  info?: {
    Title?: string
    Author?: string
    Subject?: string
    Creator?: string
    Producer?: string
  }
}

export interface PDFParseError {
  error: string
  code: 'ENCRYPTED' | 'CORRUPTED' | 'EMPTY' | 'TOO_LARGE' | 'INVALID_FORMAT' | 'UNKNOWN'
  message: string
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB limit

/**
 * Extract text content from a PDF file buffer using pdfjs-dist
 */
export async function extractTextFromPDF(
  fileBuffer: Buffer
): Promise<PDFParseResult | PDFParseError> {
  try {
    // Check file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return {
        error: 'File too large',
        code: 'TOO_LARGE',
        message: `PDF file size exceeds 20MB limit (${Math.round(fileBuffer.length / 1024 / 1024)}MB)`,
      }
    }

    // Import pdfjs-dist with legacy build for Node.js compatibility
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')

    // Disable worker for server-side rendering (avoids DOMMatrix error)
    pdfjsLib.GlobalWorkerOptions.workerSrc = ''

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(fileBuffer),
      useSystemFonts: true,
      isEvalSupported: false,
      useWorkerFetch: false,
    })

    const pdf = await loadingTask.promise

    // Extract text from all pages
    let fullText = ''
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n\n'
    }

    // Check if PDF is empty
    if (!fullText || fullText.trim().length === 0) {
      return {
        error: 'Empty PDF',
        code: 'EMPTY',
        message: 'PDF contains no extractable text. It may be image-based or blank.',
      }
    }

    // Get metadata
    const metadata = await pdf.getMetadata().catch(() => null)

    return {
      text: fullText.trim(),
      numPages: pdf.numPages,
      info: metadata?.info || undefined,
    }
  } catch (error: any) {
    // Handle specific PDF errors
    if (error.message?.includes('encrypted') || error.message?.includes('password')) {
      return {
        error: 'Encrypted PDF',
        code: 'ENCRYPTED',
        message: 'PDF is password-protected. Please provide an unlocked version.',
      }
    }

    if (error.message?.includes('Invalid PDF') || error.message?.includes('corrupt')) {
      return {
        error: 'Corrupted PDF',
        code: 'CORRUPTED',
        message: 'Unable to read PDF file. The file may be corrupted or in an unsupported format.',
      }
    }

    console.error('PDF parse error:', error)

    // Generic error
    return {
      error: 'Failed to parse PDF',
      code: 'UNKNOWN',
      message: error.message || 'An unknown error occurred while parsing the PDF',
    }
  }
}

/**
 * Check if a parse result is an error
 */
export function isPDFParseError(result: PDFParseResult | PDFParseError): result is PDFParseError {
  return 'error' in result
}

/**
 * Format PDF info for display
 */
export function formatPDFInfo(result: PDFParseResult): string {
  const parts: string[] = []

  if (result.info?.Title) {
    parts.push(`Title: ${result.info.Title}`)
  }

  parts.push(`Pages: ${result.numPages}`)

  if (result.text.length > 0) {
    parts.push(`Characters: ${result.text.length.toLocaleString()}`)
  }

  return parts.join(' • ')
}

/**
 * Clean and normalize extracted PDF text for AI parsing
 * Removes excessive whitespace, fixes line breaks, etc.
 */
export function cleanPDFText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Fix line breaks (keep paragraph breaks)
    .replace(/\n\s*\n/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim()
}
