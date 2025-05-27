export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A'
  const digits = phone.replace(/\D/g, '')
  if (digits.length !== 10) return phone || 'N/A'
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}
