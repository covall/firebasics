const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInButton = document.getElementById('signInButton');
const singOutButton = document.getElementById('singOutButton');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInButton.onclick = () => {
  console.log('singInButton clicked');
  auth.signInWithPopup(provider);
};

signOutButton.onclick = () => {
  auth.signOut();
};

auth.onAuthStateChanged((user) => {
  if (user) {
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3><p>User ID: ${user.uid}</p>`;
  } else {
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = ``;
  }
});

const db = firebase.firestore();

const createThings = document.getElementById('createThings');
const thingsList = document.getElementById('thingsList');

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    thingsRef = db.collection('things');

    createThings.onclick = () => {
      console.log('createThings click');
      thingsRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    };

    unsubscribe = thingsRef
      .where('uid', '==', user.uid)
      .orderBy('createdAt')
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => `<li>${doc.data().name}</li>`);
        console.log({ items });
        thingsList.innerHTML = items.join('');
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
