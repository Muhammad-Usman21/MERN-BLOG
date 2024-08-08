// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "mern-blogggg.firebaseapp.com",
	projectId: "mern-blogggg",
	storageBucket: "mern-blogggg.appspot.com",
	messagingSenderId: "494597496262",
	appId: "1:494597496262:web:d87bc2cf94f6533fc8e6c7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
