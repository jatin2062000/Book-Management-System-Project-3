// const mongoose = require('mongoose')


// VALIDATION FUNCTION FOR DIFFERENT ATTRIBUTES-----
const isValid = function (value) {

    if (typeof value === "string" && value.trim().length == 0) 
    return false
    return true
}

const nameValid = function (value) {
     if (! /^[a-zA-Z]+([ -]?[a-zA-Z])*$/.test(value)) {
     return false
} return true
}
// VALIDATION FUNCTION FOR TITLE----
const isTitleValid = function (value) {
     if (value == "Mr" || value == "Miss" || value == "Mrs") return true
     return false
}

// VALIDATION FUNCTION FOR PHONE NO.-----
const isPhoneValid = function (value) {
     if (! /^[6-9]\d{9}$/.test(value)) {
     return false
}
return true
}

const isValidISBN = function (value) {                                                            //parametter
      if (! /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(value)) {
      return false
}
return true
}


const isValidreleasedAt = function (value) {
      if (! /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/.test(value)) {
      return false
}
return true
}

const isValidEmail = function (value) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
     return false
}
return true
}


const alphabetTestOfString = function (value) {
   if (!/^[A-Za-z ]+$/.test(value)) {
   return false
}
return true
}

module.exports = { isValid, isTitleValid, isPhoneValid, nameValid, isValidISBN, isValidreleasedAt, isValidEmail, alphabetTestOfString }