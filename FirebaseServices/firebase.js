import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('FirebaseServices/firebase-key.json'),
  storageBucket:'gs://online-movie-shop-b6a25.appspot.com'
});
const bucket = admin.storage().bucket()

export default {bucket};