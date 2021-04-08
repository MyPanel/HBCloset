window.onload = function() {
    var messages = [];
    var rooms = [];
    const socket = io.connect('http://35.216.77.167:8000/', {
        path: '/socket.io',
        transports: ['websocket']
    });
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var controls = document.getElementById("controls");
    var roomList = document.getElementById("roomList");
    var loginUserName = document.getElementById('username').innerText;
    var name = document.getElementById("name");
    var createRoom = document.getElementById("createRoom");

    
    socket.on("first_roomList", (data) => {
        console.log(data);
        if(data.length!=0) {
            roomList.innerHTML = "<h1><채팅방 목록></h1><br/>";
            for(var i=0;i<data.length;i++) {
                var roomName;
                var list_element = document.createElement('h3');
                list_element.innerText = data[i]
                roomName=data[i]

                list_element.onclick = (e) => {
                    socket.emit('joinRoom',{loginUserName,roomName:e.target.innerText});
                }

                var br = document.createElement('br');
                roomList.append(list_element);
                roomList.append(br);
            }
        } else {
            roomList.innerHTML = "<h3>현재 생성된 채팅방이 없습니다.</h3>"
        }
    });

    socket.on('changeRoom',(data) => {
        content.style.display = 'block';
        controls.style.display = 'block';
        roomList.style.display = 'none';
        createRoom.style.display = 'none';
        content.innerText = data.roomName + '에 입장하셨습니다.';
    });

    socket.on('message', (data) => {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log('오류')
        }
    });

    createRoom.onclick = () => {
        var roomName = prompt("방 제목을 입력해주세요.");
        console.log(loginUserName, roomName);
        socket.emit('createRoom',{loginUserName,roomName});
    }
    
    sendButton.onclick = () => {
        if(name.value == "") {
            alert("Please type your name!");
        } else {
            var text = field.value;
            socket.emit('send', { message: text, username: name.value });
            field.value = ''
        }
    };

}
