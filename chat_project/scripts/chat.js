// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom{
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    async addChat(message){
        // frmat a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)

        };

        // save the chat document
        const response = await this.chats.add(chat);
        return response;
    }

    // get the chat
    getChat(callback){
        this.unsub = this.chats
            .where('room','==', this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if(change.type === 'added'){
                        // update the ui
                        callback(change.doc.data());
                    }
                });
            });
    }
    // update username 
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }

    // update the room
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }  
    }
}

// const chatroom = new Chatroom('gaming', 'smith');
// console.log(chatroom);

// chatroom.addChat('hello everyone')
//     .then(() => console.log('chat added'))
//     .catch(err => console.log(err));
// chatroom.getChat((data) => {
//     console.log(data);
// });

// chatroom.updateRoom('gaming');
// setTimeout(() => {
//     chatroom.updateRoom('gaming');
//     chatroom.updateName('kafui');
//     chatroom.getChat((data) => {
//         console.log(data);
//     });
//     chatroom.addChat('hello')
// }, 4000);