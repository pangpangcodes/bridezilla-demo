/**
 * Tag normalization utilities for vendor library tags
 */

export function normalizeTags(tags: string[]): string[] {
  return Array.from(new Set(
    tags
      .map(tag => tag.toLowerCase().trim())
      .map(tag => tag.replace(/\s+/g, '-'))
      .map(tag => tag.replace(/[^a-z0-9-]/g, ''))
      .filter(tag => tag.length > 0)
  ))
}

export function validateTag(tag: string): { valid: boolean; error?: string } {
  if (!tag || tag.trim().length === 0) {
    return { valid: false, error: 'Tag cannot be empty' }
  }

  if (tag.length > 30) {
    return { valid: false, error: 'Tag must be 30 characters or less' }
  }

  return { valid: true }
}
