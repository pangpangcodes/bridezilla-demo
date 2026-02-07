import { Vendor, VendorStats, Payment } from '@/types/vendor'
import { formatDate } from './format'

/**
 * Calculate the total cost for a single vendor (sum of non-refundable payments)
 */
export function calculateVendorCost(vendor: Vendor): number {
  return (vendor.payments || [])
    .filter(p => !p.refundable)
    .reduce((sum, p) => sum + (p.amount || 0), 0)
}

/**
 * Calculate the converted cost for a single vendor (sum of non-refundable payment conversions)
 * Returns in CAD by default
 */
export function calculateVendorConvertedCost(vendor: Vendor): number {
  return (vendor.payments || [])
    .filter(p => !p.refundable)
    .reduce((sum, p) => sum + (p.amount_converted || 0), 0)
}

/**
 * Calculate total paid for a single vendor (sum of paid non-refundable payments)
 */
export function calculateVendorPaid(vendor: Vendor): number {
  return (vendor.payments || [])
    .filter(p => !p.refundable && p.paid)
    .reduce((sum, p) => sum + (p.amount_converted || p.amount || 0), 0)
}

/**
 * Calculate outstanding balance for a single vendor
 */
export function calculateVendorOutstanding(vendor: Vendor): number {
  const total = calculateVendorConvertedCost(vendor)
  const paid = calculateVendorPaid(vendor)
  return total - paid
}

export function calculateVendorStats(vendors: Vendor[]): VendorStats {
  const totalVendors = vendors.length

  // Calculate total cost across all vendors (converted to CAD)
  const totalCost = vendors.reduce((sum, vendor) => {
    return sum + calculateVendorConvertedCost(vendor)
  }, 0)

  // Calculate total paid across all vendors (converted to CAD)
  const totalPaid = vendors.reduce((sum, vendor) => {
    return sum + calculateVendorPaid(vendor)
  }, 0)

  // Calculate total outstanding (unpaid) amount across all vendors
  const totalOutstanding = vendors.reduce((sum, vendor) => {
    return sum + calculateVendorOutstanding(vendor)
  }, 0)

  return {
    totalVendors,
    totalCost,
    totalPaid,
    totalOutstanding
  }
}

export function formatCurrency(amount: number | undefined, currencyCode: string = 'USD'): string {
  if (amount === undefined || amount === null) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getCurrencySymbol(currencyCode: string): string {
  const symbols: { [key: string]: string } = {
    'CAD': '$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': '$',
    'CHF': 'Fr'
  }
  return symbols[currencyCode] || currencyCode
}

export function calculateBalanceDue(totalCost?: number, depositAmount?: number, depositPaid?: boolean, finalPaymentPaid?: boolean): number {
  if (!totalCost) return 0
  if (finalPaymentPaid) return 0

  const deposit = depositPaid ? (depositAmount || 0) : 0
  return totalCost - deposit
}

export function exportVendorsToCSV(vendors: Vendor[]): string {
  const headers = [
    'Vendor Name',
    'Type',
    'Contact Name',
    'Email',
    'Phone',
    'Website',
    'Vendor Currency',
    'Vendor Cost',
    'Converted Cost',
    'Converted Currency',
    'Contract Required',
    'Contract Signed',
    'Contract Signed Date',
    'Payment Description',
    'Payment Amount',
    'Payment Currency',
    'Payment Converted Amount',
    'Payment Converted Currency',
    'Payment Type',
    'Payment Due Date',
    'Payment Paid',
    'Payment Paid Date',
    'Refundable',
    'Notes'
  ]

  // Flatten payments: one row per payment, or one row if no payments
  const rows: string[][] = []

  vendors.forEach(vendor => {
    const baseRow = [
      vendor.vendor_name || '',
      vendor.vendor_type,
      vendor.contact_name || '',
      vendor.email || '',
      vendor.phone || '',
      vendor.website || '',
      vendor.vendor_currency || 'CAD',
      formatCurrency(vendor.vendor_cost, vendor.vendor_currency),        // Auto-calculated by DB trigger
      formatCurrency(vendor.cost_converted, vendor.cost_converted_currency), // Auto-calculated by DB trigger
      vendor.cost_converted_currency || 'CAD',
      vendor.contract_required ? 'Yes' : 'No',
      vendor.contract_signed ? 'Yes' : 'No',
      vendor.contract_signed_date || '',
    ]

    if (vendor.payments && vendor.payments.length > 0) {
      // One row per payment
      vendor.payments.forEach(payment => {
        // Format payment type to be human-readable
        const formattedPaymentType = payment.payment_type === 'bank_transfer'
          ? 'Bank Transfer'
          : payment.payment_type === 'cash'
          ? 'Cash'
          : ''

        rows.push([
          ...baseRow,
          payment.description || '',
          payment.amount?.toString() || '0',
          payment.amount_currency || vendor.vendor_currency || '',
          payment.amount_converted?.toString() || '',                                    // Renamed from amount_cad
          payment.amount_converted_currency || '',                                       // NEW: flexible currency!
          formattedPaymentType,
          payment.due_date || '',
          payment.paid ? 'Yes' : 'No',
          payment.paid_date || '',
          payment.refundable ? 'Yes' : 'No',
          vendor.notes || ''
        ])
      })
    } else {
      // No payments: one row with empty payment fields
      rows.push([
        ...baseRow,
        '', '', '', '', '', '', '', '', '', '',  // Empty payment fields (10 fields: description, amount, currency, converted amount, converted currency, type, due date, paid, paid date, refundable)
        vendor.notes || ''
      ])
    }
  })

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
}
