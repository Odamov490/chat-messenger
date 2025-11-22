export function handleVideoSocketEvents(io, socket) {
  // Simple signaling for WebRTC
  socket.on("call_user", ({ targetUserId, offer }) => {
    io.to(targetUserId).emit("incoming_call", {
      fromUserId: socket.user.id,
      fromUsername: socket.user.username,
      offer
    });
  });

  socket.on("answer_call", ({ targetUserId, answer }) => {
    io.to(targetUserId).emit("call_answered", {
      fromUserId: socket.user.id,
      answer
    });
  });

  socket.on("ice_candidate", ({ targetUserId, candidate }) => {
    io.to(targetUserId).emit("ice_candidate", {
      fromUserId: socket.user.id,
      candidate
    });
  });
}
