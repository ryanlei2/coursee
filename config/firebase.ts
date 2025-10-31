import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, CollectionReference, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, child, equalTo, orderByValue } from 'firebase/database';
import { Auth, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate required environment variables
if (!firebaseConfig.apiKey) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_API_KEY environment variable');
}
if (!firebaseConfig.authDomain) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN environment variable');
}
if (!firebaseConfig.projectId) {
  throw new Error('Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable');
}

// initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore reference from app
export const db = getFirestore(app);
export const userSelectionRef = collection(db, "userSelection");
export const userFeedbackRef = collection(db, "userFeedback");
export const userResultsRef = collection(db, "userResults");

// Realtime Database reference from app
export const rtdb = getDatabase(app);
export const coursesRef = ref(rtdb, "courses") 

// Auth
export const auth = getAuth();

//collections within the firebase realtime db... also need one for courses.. yea?
export const adminsCollection = collection(db, 'admins');
export const coursesCollection = collection(db, 'courses');

// Function to check if a user is an admin
export async function checkAdmin(userId: string): Promise<boolean> {
  try {
    //refer to admin collection within db
    const adminsRef = ref(rtdb, "admins");
    //await the current list of admins
    const snapshot = await get(adminsRef);
    //once gotten set it to constant of all admins
    const admins = snapshot.val();
    
    //check if admins list is not empty and inclues current users id
    const isAdmin = admins && Object.values(admins).includes(userId);
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export const sendPasswordResetEmail = async (auth: Auth, email: string): Promise<void> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}


export function saveSurveyData(surveyData: { question: string; answer: any; }[]): Promise<void> {
  //take user id
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User is not logged in.');
    return Promise.reject(new Error('User is not logged in'));
  }
  //add document to the userSelectionRef firestore db with time added and data, which is survey res
  return addDoc(userSelectionRef, {
    userId: userId,
    timestamp: serverTimestamp(),
    data: surveyData,
  })
    .then(() => {
      // Survey data saved successfully
    })
    .catch((error: unknown) => {
      console.error("Error saving survey data: ", error);
      throw error;
    });
}

export function saveUserFeedback(feedback: string[]): Promise<void> {
  //take user id
  const userId = auth.currentUser?.uid;
  const email = auth.currentUser?.email;
  if (!email) {
    console.error('User email not available.');
    return Promise.reject(new Error('User email not available'));
  }
  if (!userId) {
    console.error('User is not logged in.');
    return Promise.reject(new Error('User is not logged in'));
  }
  //add document to the userSelectionRef firestore db with time added and data, which is user feedback
  return addDoc(userFeedbackRef, {
    userId: userId,
    userEmail: email,
    date: new Date().toLocaleDateString('en-GB'),
    data: feedback
  })
    .then(() => {
      // User feedback saved successfully
    })
    .catch((error: unknown) => {
      console.error("Error saving user feedback: ", error);
      throw error;
    });
}
