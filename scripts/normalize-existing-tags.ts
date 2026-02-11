/**
 * Script to normalize all existing tags in the database
 * Run with: npx tsx scripts/normalize-existing-tags.ts [--dry-run]
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { normalizeTags } from '../lib/tagUtils'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables:')
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface VendorWithTags {
  id: string
  vendor_name: string
  vendor_type: string
  tags: string[] | null
}

async function normalizeExistingTags(dryRun: boolean = false) {
  console.log('🔍 Fetching all vendors with tags...\n')

  // Fetch all vendors with tags
  const { data: vendors, error } = await supabase
    .from('planner_vendor_library')
    .select('id, vendor_name, vendor_type, tags')
    .not('tags', 'is', null)

  if (error) {
    console.error('❌ Error fetching vendors:', error)
    process.exit(1)
  }

  if (!vendors || vendors.length === 0) {
    console.log('✅ No vendors with tags found')
    return
  }

  console.log(`📊 Found ${vendors.length} vendors with tags\n`)

  let changedCount = 0
  let unchangedCount = 0
  const changes: Array<{
    vendor_name: string
    vendor_type: string
    old_tags: string[]
    new_tags: string[]
  }> = []

  // Check each vendor's tags
  for (const vendor of vendors as VendorWithTags[]) {
    if (!vendor.tags || vendor.tags.length === 0) continue

    const normalizedTags = normalizeTags(vendor.tags)

    // Compare original and normalized
    const originalSorted = JSON.stringify([...vendor.tags].sort())
    const normalizedSorted = JSON.stringify([...normalizedTags].sort())

    if (originalSorted !== normalizedSorted) {
      changedCount++
      changes.push({
        vendor_name: vendor.vendor_name,
        vendor_type: vendor.vendor_type,
        old_tags: vendor.tags,
        new_tags: normalizedTags
      })

      if (!dryRun) {
        // Update the vendor with normalized tags
        const { error: updateError } = await supabase
          .from('planner_vendor_library')
          .update({ tags: normalizedTags })
          .eq('id', vendor.id)

        if (updateError) {
          console.error(`❌ Error updating ${vendor.vendor_name}:`, updateError)
        }
      }
    } else {
      unchangedCount++
    }
  }

  // Report results
  console.log('='.repeat(70))
  console.log('📋 NORMALIZATION RESULTS')
  console.log('='.repeat(70))

  if (changes.length > 0) {
    console.log(`\n🔧 ${changedCount} vendor${changedCount !== 1 ? 's' : ''} with tags that ${dryRun ? 'would be' : 'were'} normalized:\n`)

    changes.forEach(({ vendor_name, vendor_type, old_tags, new_tags }) => {
      console.log(`📍 ${vendor_name} (${vendor_type})`)
      console.log(`   Before: [${old_tags.join(', ')}]`)
      console.log(`   After:  [${new_tags.join(', ')}]`)
      console.log('')
    })
  }

  console.log(`✅ ${unchangedCount} vendor${unchangedCount !== 1 ? 's' : ''} already had normalized tags`)
  console.log(`🔧 ${changedCount} vendor${changedCount !== 1 ? 's' : ''} ${dryRun ? 'would be' : 'were'} updated`)
  console.log('='.repeat(70))

  if (dryRun && changedCount > 0) {
    console.log('\n💡 This was a dry run. Run without --dry-run to apply changes.')
  } else if (!dryRun && changedCount > 0) {
    console.log('\n✅ All tags have been normalized!')
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')

if (dryRun) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n')
}

normalizeExistingTags(dryRun)
  .then(() => {
    console.log('\n✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
