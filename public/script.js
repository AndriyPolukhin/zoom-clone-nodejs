// * Import the socket
const socket = io('/');
// * Create an video element
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

// * Set up peer options
let peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
});

// * Access to the video and audio
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((error) => console.log(error.message));

//   * Join the room
peer.on('open', (id) => {
  console.log({ id });
  socket.emit('join-room', ROOM_ID, id);
});

// * Connect to new user
const connectToNewUser = (userId, stream) => {
  console.log({ userId });
  // * Connect to the user
  const call = peer.call(userId, stream);
  const video = document.createElement('video');
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// * Create a @fn to add the video to the stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
};
