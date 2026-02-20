import { MOCK_VENDORS, MOCK_RSVPS } from './mock-data'

const STORAGE_KEY_PREFIX = 'ksmt_demo_'

export class DemoSupabaseClient {
  private getStorageKey(table: string): string {
    return `${STORAGE_KEY_PREFIX}${table}`
  }

  private getData(table: string): any[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(this.getStorageKey(table))
    return data ? JSON.parse(data) : []
  }

  private setData(table: string, data: any[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey(table), JSON.stringify(data))
  }

  initializeDemo() {
    // Initialize with mock data if not already present
    if (typeof window === 'undefined') return

    if (!localStorage.getItem(this.getStorageKey('vendors'))) {
      // Process dynamic dates before storing
      const vendors = MOCK_VENDORS.map(vendor => {
        if (vendor.payments) {
          return {
            ...vendor,
            payments: vendor.payments.map((payment: any) => {
              // Replace sentinel value with calculated date
              if (typeof payment.due_date === 'string' && payment.due_date.startsWith('__DYNAMIC_DATE_OFFSET_')) {
                const offset = parseInt(payment.due_date.match(/__DYNAMIC_DATE_OFFSET_(\d+)__/)?.[1] || '0')
                const futureDate = new Date()
                futureDate.setDate(futureDate.getDate() + offset)
                return {
                  ...payment,
                  due_date: futureDate.toISOString().split('T')[0]
                }
              }
              return payment
            })
          }
        }
        return vendor
      })
      this.setData('vendors', vendors)
    }
    if (!localStorage.getItem(this.getStorageKey('rsvps'))) {
      this.setData('rsvps', MOCK_RSVPS)
    }

    // Initialize planner tables if not present
    if (!localStorage.getItem(this.getStorageKey('planner_couples'))) {
      this.setData('planner_couples', [])
    }
    if (!localStorage.getItem(this.getStorageKey('shared_vendors'))) {
      this.setData('shared_vendors', [])
    }
    if (!localStorage.getItem(this.getStorageKey('vendor_activity'))) {
      this.setData('vendor_activity', [])
    }
  }

  resetDemo() {
    // Clear all demo data and reinitialize
    if (typeof window === 'undefined') return

    localStorage.removeItem(this.getStorageKey('vendors'))
    localStorage.removeItem(this.getStorageKey('rsvps'))
    localStorage.removeItem(this.getStorageKey('planner_couples'))
    localStorage.removeItem(this.getStorageKey('shared_vendors'))
    localStorage.removeItem(this.getStorageKey('vendor_activity'))
    this.initializeDemo()
  }

  from(table: string) {
    return {
      select: (query: string = '*') => {
        let data = this.getData(table)

        // Process dynamic dates at runtime
        if (table === 'vendors' && data.length > 0) {
          data = data.map(vendor => {
            if (vendor.payments) {
              return {
                ...vendor,
                payments: vendor.payments.map((payment: any) => {
                  // Replace sentinel value with calculated date
                  if (typeof payment.due_date === 'string' && payment.due_date.startsWith('__DYNAMIC_DATE_OFFSET_')) {
                    const offset = parseInt(payment.due_date.match(/__DYNAMIC_DATE_OFFSET_(\d+)__/)?.[1] || '0')
                    const futureDate = new Date()
                    futureDate.setDate(futureDate.getDate() + offset)
                    return {
                      ...payment,
                      due_date: futureDate.toISOString().split('T')[0]
                    }
                  }
                  return payment
                })
              }
            }
            return vendor
          })
        }

        // Create a proper Promise-based query builder
        const promise = Promise.resolve({ data, error: null }) as Promise<{ data: any[] | any, error: any }>

        const queryMethods = {
          eq: (field: string, value: any) => {
            return promise.then(({ data: currentData }) => {
              const filtered = (Array.isArray(currentData) ? currentData : [currentData]).filter(item => item?.[field] === value)
              return { data: filtered, error: null }
            }) as any
          },
          order: (field: string, options?: { ascending?: boolean }) => {
            return promise.then(({ data: currentData }) => {
              const ascending = options?.ascending !== false
              const sorted = [...(Array.isArray(currentData) ? currentData : [currentData])].sort((a, b) => {
                if (a[field] < b[field]) return ascending ? -1 : 1
                if (a[field] > b[field]) return ascending ? 1 : -1
                return 0
              })
              return { data: sorted, error: null }
            }) as any
          },
          single: () => {
            return promise.then(({ data: currentData }) => ({
              data: Array.isArray(currentData) ? currentData[0] || null : currentData,
              error: null
            }))
          }
        }

        // Merge query methods with the promise
        return Object.assign(promise, queryMethods)
      },
      insert: (newData: any) => {
        const data = this.getData(table)
        const now = new Date().toISOString()
        const record = {
          ...newData,
          id: crypto.randomUUID(),
          created_at: now,
          updated_at: now,
          last_activity: now, // For planner_couples table
        }
        data.push(record)
        this.setData(table, data)

        // Return chainable query builder
        return {
          select: (query: string = '*') => ({
            single: () => Promise.resolve({ data: record, error: null }),
            then: (resolve: any) => resolve({ data: [record], error: null })
          }),
          then: (resolve: any) => resolve({ data: record, error: null })
        }
      },
      update: (updates: any) => ({
        eq: (field: string, value: any) => {
          const data = this.getData(table)
          const index = data.findIndex(item => item[field] === value)
          if (index !== -1) {
            data[index] = {
              ...data[index],
              ...updates,
              updated_at: new Date().toISOString()
            }
            this.setData(table, data)
            const updatedRecord = data[index]
            return {
              select: (query: string = '*') => ({
                single: () => Promise.resolve({ data: updatedRecord, error: null }),
                then: (resolve: any) => resolve({ data: [updatedRecord], error: null })
              }),
              then: (resolve: any) => resolve({ data: updatedRecord, error: null })
            }
          }
          return {
            select: (query: string = '*') => ({
              single: () => Promise.resolve({ data: null, error: null }),
              then: (resolve: any) => resolve({ data: [], error: null })
            }),
            then: (resolve: any) => resolve({ data: null, error: null })
          }
        }
      }),
      delete: () => ({
        eq: (field: string, value: any) => {
          let data = this.getData(table)
          data = data.filter(item => item[field] !== value)
          this.setData(table, data)
          return Promise.resolve({ data: null, error: null })
        }
      })
    }
  }
}

export const demoSupabase = new DemoSupabaseClient()
