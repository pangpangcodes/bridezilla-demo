/**
 * Test script for tag normalization
 * Run with: node scripts/test-tag-normalization.js
 */

// Inline normalization function for testing
function normalizeTags(tags) {
  return Array.from(new Set(
    tags
      .map(tag => tag.toLowerCase().trim())
      .map(tag => tag.replace(/\s+/g, '-'))
      .map(tag => tag.replace(/[^a-z0-9-]/g, ''))
      .filter(tag => tag.length > 0)
  ))
}

const testCases = [
  {
    name: 'Lowercase conversion',
    input: ['Cinema', 'DRONE', 'documentary'],
    expected: ['cinema', 'drone', 'documentary']
  },
  {
    name: 'Space to hyphen replacement',
    input: ['hair styling', 'bridal  hair'],
    expected: ['hair-styling', 'bridal-hair']
  },
  {
    name: 'Special character removal',
    input: ['tag!@#', 'valid-tag', ''],
    expected: ['tag', 'valid-tag']
  },
  {
    name: 'Deduplication',
    input: ['duplicate', 'DUPLICATE', 'duplicate'],
    expected: ['duplicate']
  },
  {
    name: 'Mixed case and special chars',
    input: ['Natural Light', 'drone-footage', 'CINEMATIC!!!'],
    expected: ['natural-light', 'drone-footage', 'cinematic']
  }
]

function runTests() {
  console.log('🔍 Running tag normalization tests...\n')

  let passed = 0
  let failed = 0

  testCases.forEach(({ name, input, expected }) => {
    const result = normalizeTags(input)
    const resultStr = JSON.stringify(result.sort())
    const expectedStr = JSON.stringify(expected.sort())
    const match = resultStr === expectedStr

    if (match) {
      console.log(`✅ ${name}`)
      passed++
    } else {
      console.error(`❌ ${name}`)
      console.error(`  Input:    ${JSON.stringify(input)}`)
      console.error(`  Expected: ${expectedStr}`)
      console.error(`  Got:      ${resultStr}`)
      failed++
    }
  })

  console.log(`\n${'='.repeat(50)}`)
  console.log(`✅ ${passed} tests passed`)
  if (failed > 0) {
    console.log(`❌ ${failed} tests failed`)
  }
  console.log(`${'='.repeat(50)}`)

  process.exit(failed > 0 ? 1 : 0)
}

runTests()
