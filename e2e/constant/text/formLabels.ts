import { FormLabels } from "../../poms/form"

export const FORM_LABELS = {
    fullName: 'Full name',
    phNO:'Phone number',
    multi: 'Multi choice',
    single: 'Single choice',
    formTitle: 'Form Title',
    startFromScratch:'Start from scratchA blank',
    addNewForm:'Add new form',
    email:'Question 1Email address*',
    question:'Question 1Interested in',
    bulkOptionAdd:'OptionsAdd optionAdd bulk'
}

export const FORM_LABEL1 : FormLabels[]= [
    { button:'Opinion scale', question:'Opinion scale' },
    { button:'Star rating', question:'Star rating' },
    { button:'Matrix', question:'Matrix'}
]

export const FORM_LABEL2 : FormLabels[]= [
    { button:'Opinion scale', question:'Rate overall service', advanceFill:"customer_rating"},
    { button:'Star rating', question:'Rate customer service', advanceFill:"customer_service" },
    { button:'Matrix', question:'Rate customer representative',advanceFill:"customer_rep"}
]
