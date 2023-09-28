import { boot } from 'quasar/wrappers';
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

console.log('firebase ok');

const firebaseConfig = {
  apiKey: 'AIzaSyDcXTxS4T05qmDMENC7CB92sPRD1_6zIg0',
  authDomain: 'menupptest-1ce8a.firebaseapp.com',
  projectId: 'menupptest-1ce8a',
  storageBucket: 'menupptest-1ce8a.appspot.com',
  messagingSenderId: '964720662810',
  appId: '1:964720662810:web:b1d45fcc6c3ffbab54f4a3',
  measurementId: 'G-JGL247VFHW',
};

const firebaseApp = initializeApp(firebaseConfig);

export default boot(({ app }) => {
  // Hacer que Firebase esté disponible en toda la aplicación
  app.config.globalProperties.$firebase = firebaseApp;
});
