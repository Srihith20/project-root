import { Client, Databases, Storage, ID, Account } from 'appwrite';

const client = new Client();

client
  .setProject('67f2ae0b002ffcc59dcb')
  .setEndpoint('https://cloud.appwrite.io/v1'); // no trailing space

const databases = new Databases(client);
const storage = new Storage(client);
export const account = new Account(client);
export { client, databases, storage, ID };

