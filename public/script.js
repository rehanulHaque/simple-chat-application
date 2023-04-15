const socket = io()

//  Getting username and room from query string

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//  Get Room Users
socket.on('roomUser', ({room, users})=>{
    console.log(room, users)
    outputRoom(room)
    outputUser(users)
})

//  join chat room
socket.emit("joinRoom", {username, room})

//  Messahe from Server
socket.on('message', (message)=>{
    // console.log(message)
    outputMessage(message)
})

const form = document.getElementById('chat-form')

//  Submit Message
form.addEventListener('submit', (e)=>{
    e.preventDefault()

    //  Getting input value
    const msg = e.target.elements.msg.value

    //  Emit Message to server
    socket.emit("chatMessage", msg)

    //  Clearing Input value
    e.target.elements.msg.value = ""
})


//  Output Message to DOM
const outputMessage = (message)=>{
    const container = document.querySelector(".container")
    const html = `<p class="text"><b>${message.username} <small><span>${message.time}</span></small></b><br>${message.text}</p>`
    container.innerHTML += html
}

const outputRoom = (room) =>{
    const h3 = document.querySelector('.roomname')
    h3.innerHTML = `Room name : ${room}`
}
const outputUser = (user) =>{
    const sidebar = document.querySelector('.sidebar')

    let html = ''
    user.forEach(user =>{
        html += `<p class="user">${user.username}</p>`
        sidebar.innerHTML = html
    })

}