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
    getMessages();
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
})

function sendMessage() {
    var myCollection = firebase.database().ref('messages');
    var message = document.getElementById('message').value;
    myCollection.push({ message: message });
    document.getElementById('message').value = '';
}

function deleteMessage(id) {
    // find message whose objectId is equal to the id we're searching with
    var messageReference = firebase.database().ref('/messages/' + id);
    messageReference.remove()
};

function getMessages() {
    var messageDisplay = document.getElementsByClassName('messages')[0];

    firebase.database().ref('messages').on('value', function (results) {
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
                deleteMessage(id)
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