const Joi = require('joi');
const contacts = require('../models/contacts');
const HttpError = require('../helpers/HttpError');
const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
})

const getAll = async (req, res) => {

    const result = await contacts.listContacts()
    res.json(result)

    res.status(500).json({
        message: 'server error'
    })


}

const getById = async (req, res, next) => {
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
}


const add = async (req, res, next) => {
    try {
        const { error } = addSchema.validate(req.body)
        console.log(req.body);
        if (error) {
            throw  HttpError(400, error.message)
        }

        const result = await contacts.addContact(req.body)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }

}

const updateById = async (req, res, next) => {
    try {
        const { error } = addSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message);
        }

        const { contactId } = req.params
        const result = await contacts.updateContact(contactId, req.body)
        console.log(result, 'LOG');

        if (!result) {
            throw HttpError(404, 'Contact not found');
        }

        res.json(result)
    } catch (error) {
        next(error)
    }
}


const remove = async (req, res, next) => {
    try {
        const { contactId } = req.params
        const result = await contacts.removeContact(contactId)
        console.log(result);
        if (!result) {
            throw HttpError(404, 'Contact not found');
        }

        res.json({
            message: 'Delete success'
        });
    } catch (error) {
        next(error)
    }
}
module.exports = {
    getAll,
    getById,
    add,
    updateById,
    remove,
}