// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
let md5 = require("md5");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9Dm-70pZm27HIF0iB3QC4Xu9KM7JEd2c",
    authDomain: "eventify-34ac6.firebaseapp.com",
    projectId: "eventify-34ac6",
    storageBucket: "eventify-34ac6.appspot.com",
    messagingSenderId: "259623971337",
    appId: "1:259623971337:web:2dc25c7efd9e2a2aff66d8"
  };

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAnalytics = getAnalytics(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);


export const handleUploadFirebaseImage = async (name, image) => {
    const formatFile = '.'+name.split('.')[1];
    const firebaseFileName = md5(name+(new Date()))+formatFile;

    const storageRef = ref(firebaseStorage, `files/${firebaseFileName}`);
    await uploadBytesResumable(storageRef, image);

    return firebaseFileName; 
}

export const getFirebaseImage = async (name) => {
    return await getDownloadURL(ref(firebaseStorage, name));
}

export const deleteFirebaseImage = async (name) => {
    const fileRef = ref(firebaseStorage, name);
    try{
        await deleteObject(fileRef);
    }catch(error){
        throw new Error(error);
    }
}