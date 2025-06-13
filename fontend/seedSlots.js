// seedSlots.js
import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your endpoint
  .setProject('67f2ae0b002ffcc59dcb') // Replace with your project ID
//   .setKey('YOUR_API_KEY');  

const databases = new Databases(client);

const SLOT_DB_ID = '67f2b0cf001283997675';
const SLOT_COLLECTION_ID = '67f2b7ea00289cc872f3';

const slots = [
  { date: '2025-04-07', time: '10:00 AM', capacity: 5, bookedBy: [], status: 'available' },
  { date: '2025-04-07', time: '11:00 AM', capacity: 3, bookedBy: [], status: 'available' },
  { date: '2025-04-08', time: '02:00 PM', capacity: 4, bookedBy: [], status: 'available' },
  { date: '2025-04-08', time: '03:00 PM', capacity: 2, bookedBy: [], status: 'available' },
  { date: '2025-04-09', time: '04:00 PM', capacity: 6, bookedBy: [], status: 'available' },
];

const seedSlots = async () => {
  for (let slot of slots) {
    try {
      await databases.createDocument(
        SLOT_DB_ID,
        SLOT_COLLECTION_ID,
        'unique()', // Let Appwrite generate the document ID
        slot
      );
      console.log(`Inserted slot on ${slot.date} at ${slot.time}`);
    } catch (err) {
      console.error('Failed to insert slot:', err);
    }
  }
};

seedSlots();
