export const loanRules = {
  iof: 6.38,
  interest_rate: 2.34,
  vehicle: {
    quotas: [24, 36, 48],
    loan_min_value: 3000,
    loan_max_value: 100000,
    warranty_min_value: 5000,
    warranty_max_value: 3000000
  },
  property: {
    quotas: [120, 180, 240],
    loan_min_value: 30000,
    loan_max_value: 4500000,
    warranty_min_value: 50000,
    warranty_max_value: 100000000
  }
}
