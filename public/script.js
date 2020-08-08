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
  port: '443',
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

    // * Get the messages
    let text = $('input');

    $('html').keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit('message', text.val());
        text.val('');
      }
    });

    socket.on('createMessage', (message) => {
      console.log(`Message from the server: ${message}`);
      $('.messages').append(
        `<li class="message"><b>user</b><br />${message}</li>`
      );
      scrollToBottom();
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

// * Chat: Scroll to Bottom @fn. Will scroll in the chat div, so the messages would not exceed the page height!!!
const scrollToBottom = () => {
  let d = $('.main__chat__window');
  d.scrollTop(d.prop('scrollHeight'));
};

// * Mute our video and change the icon
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
  <i class="fas fa-microphone"></i>
  <span>Mute</span>
  `;
  document.querySelector('.main__mute__button').innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector('.main__mute__button').innerHTML = html;
};

// * Stop/Play Video and change the icon
const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector('.main__video__button').innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;

  document.querySelector('.main__video__button').innerHTML = html;
};
