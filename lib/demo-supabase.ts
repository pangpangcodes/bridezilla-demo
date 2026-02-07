import { MOCK_VENDORS, MOCK_RSVPS } from './mock-data'

const STORAGE_KEY_PREFIX = 'bridezilla_demo_'

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
  }

  resetDemo() {
    // Clear all demo data and reinitialize
    if (typeof window === 'undefined') return

    localStorage.removeItem(this.getStorageKey('vendors'))
    localStorage.removeItem(this.getStorageKey('rsvps'))
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

        return Promise.resolve({ data, error: null })
      },
      insert: (newData: any) => {
        const data = this.getData(table)
        const record = {
          ...newData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        data.push(record)
        this.setData(table, data)
        return Promise.resolve({ data: record, error: null })
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
            return Promise.resolve({ data: data[index], error: null })
          }
          return Promise.resolve({ data: null, error: null })
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
