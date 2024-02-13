import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyC3vrIfXJsAVNcqpbsvZ6omBkuJTI8wmek",
  authDomain: "mern-blog-c0eff.firebaseapp.com",
  projectId: "mern-blog-c0eff",
  storageBucket: "mern-blog-c0eff.appspot.com",
  messagingSenderId: "806619713938",
  appId: "1:806619713938:web:dfe76bd4cced35d62b714b",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((e) => console.log(e));

  return user;
};
