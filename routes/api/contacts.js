const express = require('express')
const Joi = require('joi');
const contacts = require('../../models/contacts');
const HttpError = require('../../helpers/HttpError');
const router = express.Router()




router.get('/', async (req, res) => {
  try {
    const result = await contacts.listContacts()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      message: 'server error'
    })
  }

})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await contacts.getContactById(contactId)
    if (!result) {
      throw HttpError(404, 'Not found')
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})





const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
})



// router.post('/', async (req, res, next) => {

//   try {
//     const { error } = addSchema.validate(req.body)
//     if (error) {
//       throw HttpError(400, error.message)
//     }

//     const result = await contacts.addContact(req.body)
//     res.status(201).json(result)



//   } catch (error) {
//     next(error)
//   }
// })




router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }

    const result = await contacts.addContact(req.body)
    res.status(200).json(result)

  } catch (error) {
    next(error)
  }

})





router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message);
    }

    const { contactId } = req.params
    const result = await contacts.updateContact(contactId, req.body)

    if (!result) {
      throw HttpError(404, 'Contact not found');
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})



router.delete('/:contactId', async (req, res, next) => {
})


module.exports = router
