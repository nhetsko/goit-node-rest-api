import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  try {
      return JSON.parse(await fs.readFile(contactsPath, { encoding: "utf-8" }));
  } catch (error) {
    throw error;
  }
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const res = contacts.filter((f) => f.id === contactId)[0];
  return res ? res : null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  } else {
    const removeContact = contacts.splice(index, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removeContact;
  }
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const contact = { id: nanoid(), name, email, phone };
  contacts.push(contact);
  try {
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return contact;
  } catch (error) {
    throw error;    
  }
}
export async function updateContactbyId(id, contact) {
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    return null;
  }

  const updContact = { ...contacts[index], ...contact };
  contacts[index] = updContact;
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updContact;
  } catch (error) {
    throw error;
  }
}