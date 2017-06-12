export default function toDollars (amountInCents, ifZero = '–', ifError = null) {
  try {
    return amountInCents === 0
      ? ifZero
      : `$${(amountInCents < 0 ? '-' : '') + (Number(amountInCents) / 100).toFixed(2)}`
  } catch (e) {
    return ifError
  }
}
