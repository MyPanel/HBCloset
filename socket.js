module.exports = (io) => {

    var list = [];

    io.on('connection', (socket) => { // 웹소켓 연결 시
        console.log('유저가 접속했습니다.');

        var currentRooms = io.sockets.adapter.rooms;
        
        for(var [key,value] of currentRooms) {
            if(key.name) {
            console.log(key);
                list.push(key.name);
            }

        }

        socket.emit("first_roomList", list);


        socket.on('roomList', (name, callback) => {
            var refreshRooms = io.sockets.adapter.rooms;
            for(var [key,value] of refreshRooms) {
                if(key.name) list.push(key.name);
            }
    
            callback(list);
        });

        socket.on('createRoom', (data) => {
            var roomName = data.roomName;
            var user = data.loginUserName;
            socket.join(roomName);      
            console.log(user,'님이 ',roomName,' 대화방을 생성했습니다.');
            list.push(roomName);
            console.log(list);
            socket.emit('changeRoom', {user, roomName});
        });

        socket.on('joinRoom', (data) => {
            var roomName = data.roomName;
            var user = data.loginUserName;
            // if(list.length>0) {
            //     for(var i=0; i<list.length; i++) {
            //         if(list[i] == roomName) {
            //             console.log(username,'님이 ',roomName,'에 입장했습니다.');
            //         }
            //     }              
            //     socket.join(roomName);      
            //     console.log(username,'님이 ',roomName,' 대화방을 생성했습니다.');
            //     list.push(roomName);
                
            // } else {
            //     socket.join(roomName);
            //     console.log(username,'님이 ',roomName,' 대화방을 생성했습니다.');
            //     console.log(list);
            //     list.push(roomName);
            // }
            socket.join(roomName);
            console.log(user,'님이 ',roomName,'에 입장했습니다.');
            socket.emit('changeRoom', {user, roomName});
            socket.to(roomName).emit('message', {message:user+' 님이 입장했습니다.'});
        });

            // 현재 같은 대화방이 있는지 확인
            // for (var key in rooms){
            //     if (key == name){
                    
            //     }   
            //     // 혼자있으면 입장
            //     if (rooms[key].length == 1){
            //         var roomKey = key.replace('/', '');
            //         socket.join(roomKey);
            //         io.sockets.in(roomKey).emit('completeMatch', {});
            //         socketRooms[socket.id] = roomKey;
            //         return;
            //     }
        // socket.emit('message', {message:'채팅방에 입장하셨습니다.'});
        socket.on('send',(data)=>{
            io.sockets.emit('message', data);
        });
    });
};

