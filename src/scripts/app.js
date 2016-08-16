// Initialize Firebase
//This happens in keys.js

document.addEventListener("DOMContentLoaded", function (event) {
    console.log('document loaded');
    if (ltmApp.isLoggedIn()) {
        document.getElementsByClassName('formSection')[0].setAttribute('style', 'display:inline-block');
        ltmApp.getMessages();
    }
    document.getElementById('sendMessage').addEventListener('click', ltmApp.sendMessage);
    document.getElementById('login').addEventListener('click', ltmApp.login);
    document.getElementById('logout').addEventListener('click', ltmApp.logout);
})

var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();
var auth = firebase.auth();

var ltmApp = {
    username: '',
    currentUser: null,
    isLoggedIn: function () {
        var self = this;
        auth.onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                self.currentUser = user;
                self.username = self.currentUser.displayName;
                return true;
            } else {
                // No user is signed in.
                self.currentUser = user;
                return false;
            }
        });
    },
    login: function () {
        var self = this;
        auth.signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // The signed-in user info.
            self.currentUser = result.user;
            self.username = result.user.displayName;
            var greeting = document.getElementById('greeting');
            greeting.innerHTML = 'Hello ' + self.username;
            ltmApp.getMessages();
            document.getElementsByClassName('formSection')[0].setAttribute('style', 'display:inline-block');
            document.getElementById('login').setAttribute('style', 'display:none');
            document.getElementById('logout').setAttribute('style', 'display:inline-block');
        }).catch(function (error) {
            console.log(error);
        })
    },
    logout: function () {
        ltmApp.currentUser = null;
        ltmApp.username = '';
        auth.signOut().then(function () {
            document.getElementById('logout').setAttribute('style', 'display:none');
            document.getElementById('login').setAttribute('style', 'display:inline-block');
            document.getElementsByClassName('formSection')[0].setAttribute('style', 'display:none');
            document.getElementsByClassName('messages')[0].setAttribute('style', 'display:none');
            document.getElementById('greeting').innerHTML = "Please sign-in.";
        }, function (error) {
            // An error happened.
        });
    },
    sendMessage: function () {
        var myCollection = database.ref('messages');
        var message = document.getElementById('message').value;
        myCollection.push({ message: message });
        document.getElementById('message').value = '';
    },

    deleteMessage: function (id) {
        // find message whose objectId is equal to the id we're searching with
        var messageReference = database.ref('/messages/' + id);
        messageReference.remove()
    },

    getMessages: function () {
        var messageDisplay = document.getElementsByClassName('messages')[0];
        var self = this;
        database.ref('messages').on('value', function (results) {
            messageDisplay.innerHTML = '';
            allMessages = [];
            var messages = results.val();
            // iterate through results coming from database call; messages
            for (var item in messages) {
                var msg = messages[item].message;
                // bind the results to the DOM
                var messageList = document.createElement('li');
                messageList.setAttribute('data-id', item);

                var deleteElement = document.createElement('span');
                deleteElement.innerHTML = ' - delete';
                deleteElement.addEventListener('click', function (e) {
                    var id = e.currentTarget.parentElement.attributes['data-id'].value
                    self.deleteMessage(id)
                })
                messageList.innerHTML = msg;
                messageList.appendChild(deleteElement);
                allMessages.push(messageList);
            }
            for (var i in allMessages) {
                messageDisplay.appendChild(allMessages[i]);
            }
        });
    }
};