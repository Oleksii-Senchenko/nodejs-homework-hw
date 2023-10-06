const fs = require('fs/promises')
const { nanoid } = require('nanoid')
const path = require('path')

const filePath = path.join(__dirname, 'contacts.json')




const listContacts = async () => {
  try {
    const result = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(result)
  } catch (error) {
    console.error(error);
  }
}


const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  return result || null;
}

const addContact = async (data) => {
  const contacts = await listContacts()
  const newContact = {
    id: nanoid(),
    ...data,
  }
  contacts.push(newContact)
  await fs.writeFile(filePath, JSON.stringify(contacts, null, 2))
  return newContact
}



const updateContact = async (contactId, data) => {
  try {
    const contacts = await listContacts()
    const index = contacts.findIndex(contact => contact.id === contactId)
    if (index === -1) {
      return null
    }

    contacts[index] = {contactId, ...data }
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2))
  } catch (error) {
    throw error
  }
}




const removeContact = async (contactId) => { }


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
