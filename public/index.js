let myAudio = new Audio('/audio.mp3');
let myAudio2 = new Audio('/conn.mp3');
var socket = io();
var inputBox = document.getElementById('inbutBox');
var msgsection = document.querySelector('.messagebox');
var onlineSection = document.querySelector('.online-section');
var sendBtn = document.querySelector('.sendBtn');


var username;
do{
    username = prompt("Enter Your Name ?");
    socket.emit('userconnected',username)
    setUserStatus('You','green')
    document.getElementById('yourname').innerHTML = username;
}while(!username)

inputBox.addEventListener('keyup',function(e){
    if(e.key === "Enter"){
        sendMSG(e.target.value);
        inputBox.value="";
    }
});

function sendMSG(msg){
    appendMSG(msg,'outgoing')
    socket.emit('sentmsg',msg)
    scrollToBottom();
}

function appendMSG(content,type){
    var msgcontainer = document.createElement('div')
    msgcontainer.classList.add(type,'msgcontainer')
    msgcontainer.innerHTML = content;
    msgsection.appendChild(msgcontainer)
}

socket.on('msgbroadcast',(msg)=>{
   appendMSG(msg,'incomming')
   myAudio.play();
   scrollToBottom();
})

socket.on('userconnected',async(username)=>{
    var infomsg = document.createElement('div');
    infomsg.className = 'infomsg';
    infomsg.innerHTML = await`${username} is connected...`;
    msgsection.appendChild(infomsg);
    scrollToBottom()
    setUserStatus(username,'green')
    myAudio2.play();
})

socket.on('userdisconnected',(username)=>{
    var infomsg = document.createElement('div');
    infomsg.className = 'infomsg';
    infomsg.innerHTML = `${username} is disconnected...`;
    msgsection.appendChild(infomsg);
    scrollToBottom()
    //setUserStatus(username,'red')
    var onlineUserList = document.querySelectorAll('.item')
    for(var i=0;i<onlineUserList.length;i++){
        if(onlineUserList[i].lastChild.textContent == username){
            onlineUserList[i].remove()
        }
    }
    myAudio2.play()
    //console.log(document.querySelectorAll('.item')[0].lastChild.textContent)
})

function scrollToBottom() {
    msgsection.scrollTop = msgsection.scrollHeight
}

function setUserStatus(username,status){
    //<div class="item"><div class="light green"></div><div>Ankit Sharma</div></div>
    var item = document.createElement('div');
    item.className = 'item';
    var light = document.createElement('div');
    light.classList.add('light',status);
    item.appendChild(light)
    var namediv = document.createElement('div');
    namediv.innerHTML = username;
    item.appendChild(namediv);
    onlineSection.appendChild(item);
}

//Send Button Functinality to send msg
sendBtn.addEventListener('click',function(){
    
    sendMSG(inputBox.value);
    inputBox.value="";
});