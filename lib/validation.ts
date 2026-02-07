export function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 10
}

export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 500)
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 100
}

export interface ValidationError {
  field: string
  message: string
}

export function validateRSVPSubmission(data: {
  name: string
  email: string
  phone: string
  attending: boolean
  plusOnes: Array<{ name: string }>
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!isValidName(data.name)) {
    errors.push({
      field: 'name',
      message: 'Name must be between 2 and 100 characters'
    })
  }

  if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    })
  }

  if (!isValidPhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number (at least 10 digits)'
    })
  }

  if (data.plusOnes && data.plusOnes.length > 2) {
    errors.push({
      field: 'plusOnes',
      message: 'Maximum 2 plus ones allowed'
    })
  }

  if (data.plusOnes) {
    data.plusOnes.forEach((guest, index) => {
      if (!isValidName(guest.name)) {
        errors.push({
          field: `plusOnes.${index}`,
          message: `Plus one ${index + 1} name must be between 2 and 100 characters`
        })
      }
    })
  }

  return errors
}
