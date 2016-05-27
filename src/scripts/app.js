// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
};
firebase.initializeApp(config);

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('document loaded');
    var myCollection = firebase.database().ref('MyCollection');
    myCollection.push({ name: 'test'});
})