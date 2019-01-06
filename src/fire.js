import firebase from 'firebase'

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBgQ2P-6NH4m7YnRHiyYaFb0YPT0ARyk04",
    authDomain: "smiu-complaints-mgt-system.firebaseapp.com",
    databaseURL: "https://smiu-complaints-mgt-system.firebaseio.com",
    projectId: "smiu-complaints-mgt-system",
    storageBucket: "smiu-complaints-mgt-system.appspot.com",
    messagingSenderId: "85594707799"
  };

// var config = {
//   apiKey: "AIzaSyDvXpsoJ_0gJuFnqS47m96iqpEihKPUzGg",
//   authDomain: "hackathon-project-af54f.firebaseapp.com",
//   databaseURL: "https://hackathon-project-af54f.firebaseio.com",
//   projectId: "hackathon-project-af54f",
//   storageBucket: "hackathon-project-af54f.appspot.com",
//   messagingSenderId: "564273534152"
//   };

  
export const fire = firebase.initializeApp(config);
export const firebaseSignOut=fire.auth(); 
export const database=fire.database().ref('/');