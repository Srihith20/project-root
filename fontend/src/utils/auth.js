import { databases, ID } from '../appwrite';

const DB_ID = '67f2b0cf001283997675';
const USERS_COLLECTION_ID = '67f2b0d6003852f9f41d';

export async function signup({ rollNumber, email, password }) {
  try {
    const res = await databases.createDocument(DB_ID, USERS_COLLECTION_ID, ID.unique(), {
      rollNumber,
      email,
      password,
      label: 'user',
    });
    return res;
  } catch (err) {
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const res = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID, [
      {
        key: 'email',
        operator: 'equal',
        value: email,
      },
    ]);
    const user = res.documents.find(doc => doc.password === password);
    if (!user) throw new Error('Invalid credentials');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (err) {
    throw err;
  }
}

export function logout() {
  localStorage.removeItem('user');
}
