const rawContactPropertiesList = require('./hubspotPropertiesListExtractedFromAPI.contacts.json')
const rawCompaniesPropertiesList = require('./hubspotPropertiesListExtractedFromAPI.companies.json')
const rawDealsPropertiesList = require('./hubspotPropertiesListExtractedFromAPI.deals.json')

let contactsPropertiesArray = rawContactPropertiesList.results.map((item) => item.name)
let companiesPropertiesArray = rawCompaniesPropertiesList.results.map((item) => item.name)
let dealsPropertiesArray = rawDealsPropertiesList.results.map((item) => item.name)

function parameterizePropertiesArray ( key , arr) {

    arr = arr.map(encodeURIComponent)
    return '&'+ key +'=' + arr.join('&'+key+'=')
}

const contactsPropertiesURIEncodedString = parameterizePropertiesArray("properties" , contactsPropertiesArray)
const companiesPropertiesURIEncodedString = parameterizePropertiesArray("properties" , companiesPropertiesArray)
const dealsPropertiesURIEncodedString = parameterizePropertiesArray("properties" , dealsPropertiesArray)

console.log(dealsPropertiesURIEncodedString)

module.exports = { contactsPropertiesURIEncodedString , companiesPropertiesURIEncodedString , dealsPropertiesURIEncodedString }