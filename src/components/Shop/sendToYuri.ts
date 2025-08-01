import axios from 'axios';
import { ProductsDb } from './ProductDb';

// seeding to database
//sending product info to backend via http 
const sendToYuri = async () => {
  // iterate through frontend product db

  //try block for better error handling
  try {
    await axios.post('https://dhms-backend.onrender.com/products', ProductsDb, {
       headers: {
      'Content-Type': "application/json"
    },
      withCredentials: true 
      });

  console.log('sending product db over');
} catch (err) {
  console.error(`Failed to seed product`, err);
}
  
};

sendToYuri();
