import { useState } from 'react'
import { ParsedVendorOperation } from '@/types/vendor'
import ConfidenceBadge from './ConfidenceBadge'

interface VendorOperationCardProps {
  operation: ParsedVendorOperation
  onEdit: (updated: ParsedVendorOperation) => void
  onRemove: () => void
}

export default function VendorOperationCard({ operation, onEdit, onRemove }: VendorOperationCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(operation.vendor_data)
  const isUpdate = operation.action === 'update'

  const handleSave = () => {
    onEdit({
      ...operation,
      vendor_data: editedData
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(operation.vendor_data)
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-3 rounded border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isUpdate ? (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
              UPDATE
            </span>
          ) : (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
              CREATE
            </span>
          )}
          <span className="font-bold text-gray-900">
            {operation.matched_vendor_name || operation.vendor_data.vendor_name || operation.vendor_data.vendor_type || '(Unknown vendor)'}
          </span>
        </div>
      </div>

      {isUpdate && (
        <div className="text-sm font-medium text-blue-700 mb-2 bg-blue-50 px-2 py-1 rounded">
          {operation.matched_vendor_name
            ? `Updating existing ${operation.matched_vendor_name}`
            : `⚠ Updating vendor - please verify this is the correct vendor (ID: ${operation.vendor_id?.substring(0, 8)}...)`
          }
        </div>
      )}

      {!isEditing ? (
        <div className="text-sm text-gray-700 space-y-1">
          {Object.entries(operation.vendor_data).map(([key, value]) => {
            // Skip payments array - we'll display it separately
            if (key === 'payments') return null

            if (value === undefined || value === '' || value === null) return null

            // Format cost fields with currency
            let displayValue = String(value)
            if (key === 'vendor_cost_original' && operation.vendor_data.vendor_currency) {
              displayValue = `${value} ${operation.vendor_data.vendor_currency}`
            } else if (key === 'total_cost') {
              displayValue = `${value} USD`
            }

            return (
              <div key={key} className="flex gap-2">
                <span className="font-medium text-gray-600">{key.replace(/_/g, ' ')}:</span>
                <span>{displayValue}</span>
              </div>
            )
          })}

          {/* Display payments array separately */}
          {operation.vendor_data.payments && Array.isArray(operation.vendor_data.payments) && operation.vendor_data.payments.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-600 text-xs block mb-1">Payments:</span>
              <div className="space-y-1 pl-2">
                {[...operation.vendor_data.payments].sort((a: any, b: any) => {
                  // Sort by due_date chronologically (earliest first)
                  if (!a.due_date && !b.due_date) return 0
                  if (!a.due_date) return 1
                  if (!b.due_date) return -1
                  return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
                }).map((payment: any, idx: number) => (
                  <div key={idx} className="text-xs text-gray-600 space-y-0.5">
                    <div>
                      • {payment.description || `Payment ${idx + 1}`}: {payment.amount} {operation.vendor_data.vendor_currency || 'EUR'}
                      {payment.amount_converted && payment.amount_converted_currency && ` (${payment.amount_converted} ${payment.amount_converted_currency})`}
                      {payment.payment_type && (
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                          {payment.payment_type === 'cash' ? '💵 Cash' : '🏦 Bank Transfer'}
                        </span>
                      )}
                    </div>
                    {payment.due_date && <div className="pl-3 text-gray-500">Due: {payment.due_date}</div>}
                    {payment.paid && (
                      <div className="pl-3 text-green-600">
                        ✓ Paid{payment.paid_date && ` on ${payment.paid_date}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm space-y-2">
          {/* Editable fields */}
          {Object.entries(editedData).map(([key, value]) => {
            // Skip payments array for now - too complex for inline editing
            if (key === 'payments') return null

            // Skip if value is null/undefined
            if (value === undefined || value === null) return null

            return (
              <div key={key} className="flex gap-2 items-center">
                <span className="font-medium text-gray-600 w-40 text-xs">{key.replace(/_/g, ' ')}:</span>
                {typeof value === 'boolean' ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setEditedData({ ...editedData, [key]: e.target.checked })}
                    className="w-4 h-4"
                  />
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setEditedData({ ...editedData, [key]: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(value)}
                    onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                )}
              </div>
            )
          })}

          {/* Editable payments */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600 text-xs">Payments:</span>
              <button
                type="button"
                onClick={() => {
                  const newPayment = {
                    id: crypto.randomUUID(),
                    description: 'New payment',
                    amount: 0,
                    amount_currency: editedData.vendor_currency || 'USD',
                    payment_type: 'bank_transfer' as 'cash' | 'bank_transfer',
                    paid: false
                  }
                  setEditedData({
                    ...editedData,
                    payments: [...(editedData.payments || []), newPayment]
                  })
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                + Add Payment
              </button>
            </div>

            {editedData.payments && Array.isArray(editedData.payments) && editedData.payments.length > 0 ? (
              <div className="space-y-3">
                {[...editedData.payments].sort((a: any, b: any) => {
                  // Sort by due_date chronologically (earliest first)
                  if (!a.due_date && !b.due_date) return 0
                  if (!a.due_date) return 1
                  if (!b.due_date) return -1
                  return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
                }).map((payment: any, idx: number) => (
                  <div key={payment.id || idx} className="bg-gray-50 p-2 rounded border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-600 w-20">Description:</span>
                        <input
                          type="text"
                          value={payment.description || ''}
                          onChange={(e) => {
                            const newPayments = [...(editedData.payments || [])]
                            newPayments[idx] = { ...newPayments[idx], description: e.target.value }
                            setEditedData({ ...editedData, payments: newPayments })
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="e.g., Deposit, 2nd payment"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-600 w-20">Amount:</span>
                        <input
                          type="number"
                          value={payment.amount || 0}
                          onChange={(e) => {
                            const newPayments = [...(editedData.payments || [])]
                            newPayments[idx] = { ...newPayments[idx], amount: parseFloat(e.target.value) || 0 }
                            setEditedData({ ...editedData, payments: newPayments })
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-600 w-20">Converted Amount:</span>
                        <input
                          type="number"
                          value={payment.amount_converted || ''}
                          onChange={(e) => {
                            const newPayments = [...(editedData.payments || [])]
                            newPayments[idx] = { ...newPayments[idx], amount_converted: parseFloat(e.target.value) || undefined }
                            setEditedData({ ...editedData, payments: newPayments })
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          placeholder="Optional converted amount"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-600 w-20">Payment Type:</span>
                        <select
                          value={payment.payment_type || 'bank_transfer'}
                          onChange={(e) => {
                            const newPayments = [...(editedData.payments || [])]
                            newPayments[idx] = { ...newPayments[idx], payment_type: e.target.value as 'cash' | 'bank_transfer' }
                            setEditedData({ ...editedData, payments: newPayments })
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        >
                          <option value="bank_transfer">🏦 Bank Transfer</option>
                          <option value="cash">💵 Cash</option>
                        </select>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-600 w-20">Due Date:</span>
                        <input
                          type="date"
                          value={payment.due_date || ''}
                          onChange={(e) => {
                            const newPayments = [...(editedData.payments || [])]
                            newPayments[idx] = { ...newPayments[idx], due_date: e.target.value }
                            setEditedData({ ...editedData, payments: newPayments })
                          }}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-1 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={payment.paid || false}
                            onChange={(e) => {
                              const newPayments = [...(editedData.payments || [])]
                              newPayments[idx] = {
                                ...newPayments[idx],
                                paid: e.target.checked,
                                paid_date: e.target.checked ? (newPayments[idx].paid_date || new Date().toISOString().split('T')[0]) : undefined
                              }
                              setEditedData({ ...editedData, payments: newPayments })
                            }}
                            className="w-4 h-4"
                          />
                          Paid
                        </label>

                        {payment.paid && (
                          <div className="flex gap-2 items-center flex-1">
                            <span className="text-xs text-gray-600">Paid Date:</span>
                            <input
                              type="date"
                              value={payment.paid_date || ''}
                              onChange={(e) => {
                                const newPayments = [...(editedData.payments || [])]
                                newPayments[idx] = { ...newPayments[idx], paid_date: e.target.value }
                                setEditedData({ ...editedData, payments: newPayments })
                              }}
                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newPayments = (editedData.payments || []).filter((_: any, i: number) => i !== idx)
                          setEditedData({ ...editedData, payments: newPayments })
                        }}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">No payments yet. Click "+ Add Payment" to create one.</div>
            )}
          </div>
        </div>
      )}

      {operation.ambiguous_fields && operation.ambiguous_fields.length > 0 && (
        <div className="text-yellow-600 text-xs mt-2 flex items-start gap-1">
          <span>⚠</span>
          <span>Review: {operation.ambiguous_fields.join(', ')}</span>
        </div>
      )}

      {operation.warnings && operation.warnings.length > 0 && (
        <div className="text-orange-600 text-xs mt-2 flex items-start gap-1">
          <span>⚠</span>
          <span>{operation.warnings.join(', ')}</span>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
            <button
              onClick={onRemove}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 font-medium"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}
