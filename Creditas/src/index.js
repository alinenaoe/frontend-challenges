import './styles.css'
import { loanRules } from './js/loanRules'
import { formatCurrency } from './js/formatCurrency'

export const getFormValues = formElement =>
  Object.values(formElement.elements)
    .filter(element => ['SELECT', 'INPUT'].includes(element.nodeName))
    .map(element => ({
      field: element.name,
      value: element.value
    }))

export function Submit (formElement) {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault()

    const loanValue = document.getElementById('loan-value-range').value
    const warrantyValue = document.getElementById('warranty-value').value

    if (checkValues(loanValue, warrantyValue)) {
      triggerSuccessModal()
    } else {
      triggerValueAlertModal()
    }
  })
}

export function handleChangeWarrantyType (warrantyTypeElement) {
  warrantyTypeElement.addEventListener('change', () => {
    const warrantyType = warrantyTypeElement.value

    setQuotaOptions(warrantyType)
    setWarrantyValues(warrantyType)
    setLoanValues(warrantyType)
    calculateTotalLoanAmount()
  })
}

export function setQuotaOptions (warrantyType) {
  const quotaOptionsElement = document.getElementById('quota-options')
  const quotaOptions = loanRules[warrantyType].quotas
  quotaOptionsElement.innerHTML = quotaOptions.map(quotaOption =>
    `<option value=${quotaOption}>${quotaOption}</option>`
  )
}

export function setWarrantyValues (warrantyType) {
  const warrantyValueInput = document.getElementById('warranty-value')
  const warrantyValueRange = document.getElementById('warranty-value-range')
  const warrantyValueRangeLabels = document.getElementsByClassName('range__values')[0].children

  const warrantyInitialValue = loanRules[warrantyType].warranty_initial_value
  const warrantyMinValue = loanRules[warrantyType].warranty_min_value
  const warrantyMaxValue = loanRules[warrantyType].warranty_max_value

  warrantyValueInput.value = warrantyInitialValue
  warrantyValueRange.value = warrantyInitialValue
  warrantyValueRange.setAttribute('min', warrantyMinValue)
  warrantyValueRange.setAttribute('max', warrantyMaxValue)
  warrantyValueRangeLabels[0].innerHTML = formatCurrency(warrantyMinValue).replace('R$', '')
  warrantyValueRangeLabels[1].innerHTML = formatCurrency(warrantyMaxValue).replace('R$', '')
}

export function setLoanValues (warrantyType) {
  const loanValueInput = document.getElementById('loan-value')
  const loanValueRange = document.getElementById('loan-value-range')
  const loanValueRangeLabels = document.getElementsByClassName('range__values')[1].children

  const loanInitialValue = loanRules[warrantyType].loan_initial_value
  const loanMinValue = loanRules[warrantyType].loan_min_value
  const loanMaxValue = loanRules[warrantyType].loan_max_value

  loanValueInput.value = loanInitialValue
  loanValueRange.value = loanInitialValue
  loanValueRange.setAttribute('min', loanMinValue)
  loanValueRange.setAttribute('max', loanMaxValue)
  loanValueRangeLabels[0].innerHTML = formatCurrency(loanMinValue).replace('R$', '')
  loanValueRangeLabels[1].innerHTML = formatCurrency(loanMaxValue).replace('R$', '')
}

export function handleChangeQuotaOptions (quotaOptionsElement) {
  quotaOptionsElement.addEventListener('change', calculateTotalLoanAmount)
}

export function handleChangeWarrantyValuesInput (warrantyRangeElement, warrantyValueInput) {
  warrantyValueInput.addEventListener('input', (event) => {
    warrantyRangeElement.value = event.target.value
  })
}

export function handleChangeWarrantyValuesRange (warrantyRangeElement, warrantyValueInput) {
  warrantyRangeElement.addEventListener('change', (event) => {
    const loanValue = document.getElementById('loan-value-range').value
    const warrantyValue = event.target.value

    if (checkValues(loanValue, warrantyValue)) {
      warrantyValueInput.value = event.target.value
      calculateTotalLoanAmount()
    } else {
      triggerValueAlertModal()
    }
  })
}

export function handleChangeLoanValuesInput (loanRangeElement, loanValueInput) {
  loanValueInput.addEventListener('input', (event) => {
    loanRangeElement.value = event.target.value
    calculateTotalLoanAmount()
  })
}

export function handleChangeLoanValuesRange (loanRangeElement, loanValueInput) {
  loanRangeElement.addEventListener('change', (event) => {
    const warrantyValue = document.getElementById('warranty-value').value
    const loanValue = event.target.value

    if (checkValues(loanValue, warrantyValue)) {
      loanValueInput.value = event.target.value
      calculateTotalLoanAmount()
    } else {
      triggerValueAlertModal()
    }
  })
}

export function checkValues (loanValue, warrantyValue) { // Loan max value: 80% of warranty value
  const loanLimit = loanRules.loan_limit
  return loanValue <= loanLimit * warrantyValue
}

export function calculateTotalLoanAmount () {
  const iof = loanRules.iof
  const interestRate = loanRules.interest_rate
  const formValues = getFormValues(document.querySelector('.form'))

  const numberOfQuotas = formValues.find(formValue => formValue.field === 'quota-options').value
  const loanValue = formValues.find(formValue => formValue.field === 'loan-value').value

  const totalLoanAmountElement = document.getElementsByClassName('amount_container')[0].children[1]
  const totalLoanAmount = ((iof / 100) + (interestRate / 100) + (numberOfQuotas / 1000) + 1) * loanValue

  totalLoanAmountElement.innerHTML = formatCurrency(totalLoanAmount)
  calculateQuotaValue(totalLoanAmount, numberOfQuotas)
}

export function calculateQuotaValue (totalLoanAmount, numberOfQuotas) {
  const quotaValueElement = document.getElementsByClassName('quota')[0]
  const quotaValue = totalLoanAmount / numberOfQuotas

  quotaValueElement.innerHTML = `
    <strong>R$</strong>
    <span>${formatCurrency(quotaValue).replace('R$', '')}</span>
  `
}

export function triggerValueAlertModal () {
  const valueAlertModal = document.getElementById('value-alert-modal')
  valueAlertModal.style.display = 'flex'
}

export function closeValueAlertModal (modalElement, closeModalButton) {
  closeModalButton.addEventListener('click', () => { modalElement.style.display = 'none' })
}

export function triggerSuccessModal () {
  const successModal = document.getElementById('success-modal')
  successModal.style.display = 'flex'
}

export function closeSuccessModal (modalElement, closeModalButton) {
  closeModalButton.addEventListener('click', () => { modalElement.style.display = 'none' })
}

export default class CreditasChallenge {
  static initialize () {
    this.registerEvents()
  }

  static registerEvents () {
    Submit(document.querySelector('.form'))

    handleChangeWarrantyType(document.getElementById('warranty-type'))

    handleChangeQuotaOptions(document.getElementById('quota-options'))

    handleChangeWarrantyValuesInput(
      document.getElementById('warranty-value-range'),
      document.getElementById('warranty-value')
    )

    handleChangeWarrantyValuesRange(
      document.getElementById('warranty-value-range'),
      document.getElementById('warranty-value')
    )

    handleChangeLoanValuesInput(
      document.getElementById('loan-value-range'),
      document.getElementById('loan-value')
    )

    handleChangeLoanValuesRange(
      document.getElementById('loan-value-range'),
      document.getElementById('loan-value')
    )

    closeValueAlertModal(
      document.getElementById('value-alert-modal'),
      document.getElementById('close-value-alert-modal')
    )

    closeSuccessModal(
      document.getElementById('success-modal'),
      document.getElementById('close-success-modal')
    )

    calculateTotalLoanAmount()
  }
}

document.addEventListener('DOMContentLoaded', function () {
  CreditasChallenge.initialize()
})
