const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);

    // Join user's personal room for targeted notifications
    socket.on('join-room', (userId) => {
      if (userId) {
        socket.join(`user-${userId}`);
        console.log(`🟢 User ${userId} joined room user-${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected:', socket.id);
    });
  });

  return io;
};

// ====== Notification Helpers ======
const notifyNewNotice = (notice) => {
  if (io) {
    io.emit('notice-update');
    io.emit('new-notice', {
      notice,
      message: `New ${notice.category} notice posted`
    });
  }
};

const notifyUpdatedNotice = (notice) => {
  if (io) io.emit('notice-update');
};

const notifyDeletedNotice = (noticeId) => {
  if (io) io.emit('notice-update');
};

const notifyNewComment = (comment, notice, targetUserId) => {
  if (io) {
    io.emit('notification-update');
    
    if (targetUserId) {
      io.to(`user-${targetUserId}`).emit('new-comment', {
        comment,
        notice,
        message: `💬 New comment on your notice: ${notice.title}`
      });
    }
  }
};

const notifyEditedComment = (comment) => {
  if (io) {
    io.emit('notification-update');
    io.emit('comment-edited', comment);
  }
};

const notifyDeletedComment = (commentId) => {
  if (io) {
    io.emit('notification-update');
    io.emit('comment-deleted', commentId);
  }
};

module.exports = {
  initSocket,
  notifyNewNotice,
  notifyUpdatedNotice,
  notifyDeletedNotice,
  notifyNewComment,
  notifyEditedComment,
  notifyDeletedComment
};
