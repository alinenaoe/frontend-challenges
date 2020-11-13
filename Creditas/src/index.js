import './styles.css'
import { loanRules } from './js/loanRules'

export const checkFormValidity = formElement => formElement.checkValidity()

export const getFormValues = formElement =>
  Object.values(formElement.elements)
    .filter(element => ['SELECT', 'INPUT'].includes(element.nodeName))
    .map(element => ({
      field: element.name,
      value: element.value
    }))

export const toStringFormValues = values => {
  const match = matchString => value => value.field === matchString
  const IOF = 6.38 / 100
  const INTEREST_RATE = 2.34 / 100
  const TIME = values.find(match('parcelas')).value / 1000
  const VEHICLE_LOAN_AMOUNT = values.find(match('valor-emprestimo')).value

  return `Confirmação\n${values
    .map(value => `Campo: ${value.field}, Valor: ${value.value}`)
    .join('\n')}`.concat(
    `\nTotal ${(IOF + INTEREST_RATE + TIME + 1) * VEHICLE_LOAN_AMOUNT}`
  )
}

export function Send (values) {
  return new Promise((resolve, reject) => {
    try {
      resolve(toStringFormValues(values))
    } catch (error) {
      reject(error)
    }
  })
}

export function Submit (formElement) {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault()
    if (checkFormValidity(formElement)) {
      Send(getFormValues(formElement))
        .then(result => confirm(result, 'Your form submited success'))
        .catch(error => Alert('Your form submited error', error))
    }
  })
}

export function handleChangeWarrantyType (warrantyTypeElement) {
  warrantyTypeElement.addEventListener('change', () => {
    const warrantyType = warrantyTypeElement.value

    setQuotaOptions(warrantyType)
    setWarrantyValues(warrantyType)
    setLoanValues(warrantyType)
  })
}

export function setQuotaOptions (warrantyType) {
  const quotaOptionsElement = document.getElementById('quota_options')
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
  warrantyValueRangeLabels[0].innerHTML = warrantyMinValue
  warrantyValueRangeLabels[1].innerHTML = warrantyMaxValue
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
  loanValueRangeLabels[0].innerHTML = loanMinValue
  loanValueRangeLabels[1].innerHTML = loanMaxValue
}

// export function handleChangeRangeVehicleUnderWarranty (
//   warrantyRangeElement,
//   vehicleWarrantyElement
// ) {
//   const MIN_VALUE = 12000.0
//   warrantyRangeElement.addEventListener('change', function (event) {
//     vehicleWarrantyElement.value =
//       (Number(MIN_VALUE) * Number(event.target.value)) / 100 + Number(MIN_VALUE)
//   })
// }

// export function handleChangeVehicleLoanAmount (
//   loanAmountRangeElement,
//   loanAmountElement
// ) {
//   const MIN_VALUE = 30000.0
//   loanAmountRangeElement.addEventListener('change', function (event) {
//     loanAmountElement.value =
//       (Number(MIN_VALUE) * Number(event.target.value)) / 100 + Number(MIN_VALUE)
//   })
// }

export default class CreditasChallenge {
  static initialize () {
    this.registerEvents()
  }

  static registerEvents () {
    Submit(document.querySelector('.form'))

    handleChangeWarrantyType(document.getElementById('warranty-type'))

    // handleChangeRangeVehicleUnderWarranty(
    //   document.getElementById('valor-garantia-range'),
    //   document.getElementById('valor-garantia')
    // )

    // handleChangeVehicleLoanAmount(
    //   document.getElementById('valor-emprestimo-range'),
    //   document.getElementById('valor-emprestimo')
    // )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  CreditasChallenge.initialize()
})
