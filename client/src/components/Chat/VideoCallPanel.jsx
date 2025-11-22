import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const STUN_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export default function VideoCallPanel() {
  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const [inCallWith, setInCallWith] = useState(null);
  const [callingUser, setCallingUser] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = async ({ fromUserId, fromUsername, offer }) => {
      await setupPeerConnection(fromUserId);
      pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      socket.emit("answer_call", { targetUserId: fromUserId, answer });
      setInCallWith({ id: fromUserId, username: fromUsername });
    };

    const handleCallAnswered = async ({ fromUserId, answer }) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = async ({ fromUserId, candidate }) => {
      try {
        await pcRef.current.addIceCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    };

    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_answered", handleCallAnswered);
    socket.on("ice_candidate", handleIceCandidate);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
      socket.off("call_answered", handleCallAnswered);
      socket.off("ice_candidate", handleIceCandidate);
    };
  }, [socket]);

  const setupPeerConnection = async (targetUserId) => {
    if (pcRef.current) return;
    const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          targetUserId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  };

  const startCall = async (targetUserId) => {
    if (!socket || !targetUserId) return;
    await setupPeerConnection(targetUserId);
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    socket.emit("call_user", { targetUserId, offer });
    const target = onlineUsers.find((u) => u.id === targetUserId);
    setInCallWith({ id: targetUserId, username: target?.id });
  };

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setInCallWith(null);
  };

  const availableUsers = onlineUsers.filter((u) => u.id !== user?.id);

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400">Video qo'ng'iroq</h3>
      <div className="flex gap-2 flex-wrap text-xs">
        {availableUsers.map((u) => (
          <button
            key={u.id}
            onClick={() => startCall(u.id)}
            className="px-2 py-1 bg-slate-800 rounded"
          >
            📞 {u.id}
          </button>
        ))}
        {!availableUsers.length && (
          <div className="text-slate-500 text-xs">Video qo'ng'iroq uchun foydalanuvchi yo'q</div>
        )}
      </div>
      {inCallWith && (
        <div className="space-y-1">
          <div className="text-xs text-emerald-400">
            {inCallWith.username} bilan qo'ng'iroq...
          </div>
          <div className="flex gap-2">
            <video ref={localVideoRef} autoPlay muted className="w-24 h-16 bg-black rounded" />
            <video ref={remoteVideoRef} autoPlay className="w-24 h-16 bg-black rounded" />
          </div>
          <button
            onClick={endCall}
            className="mt-1 px-2 py-1 bg-red-600 rounded text-xs"
          >
            Tugatish
          </button>
        </div>
      )}
    </div>
  );
}
