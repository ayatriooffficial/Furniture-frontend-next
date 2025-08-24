"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { allSelectedData } from "@/components/Features/Slices/virtualDataSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import LiveRoomProductCard from "@/components/LiveRoom/LiveRoomProductCard";
import LiveRoomProductSlider from "@/components/LiveRoom/LiveRoomProductSlider";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import Image from "next/image";

// Utility function for debouncing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Connection quality hook
const useConnectionQuality = (peersRef) => {
  const [quality, setQuality] = useState('good');
  
  useEffect(() => {
    const checkQuality = async () => {
      const peers = Object.values(peersRef.current);
      if (peers.length === 0) return;
      
      try {
        for (const peer of peers) {
          const stats = await peer.getStats();
          stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
              const packetsLost = report.packetsLost || 0;
              const packetsReceived = report.packetsReceived || 0;
              const lossRate = packetsLost / (packetsLost + packetsReceived);
              
              if (lossRate > 0.05) {
                setQuality('poor');
              } else if (lossRate > 0.02) {
                setQuality('fair');
              } else {
                setQuality('good');
              }
            }
          });
        }
      } catch (error) {
        console.error('Error checking connection quality:', error);
      }
    };
    
    const interval = setInterval(checkQuality, 5000);
    return () => clearInterval(interval);
  }, [peersRef]);
  
  return quality;
};

const Page = ({ params }) => {
  const router = useRouter();
  const roomId = params.roomId;
  const socket = useSocket();
  const x = useSelector(allSelectedData);

  // State management
  const [hasCallStarted, setHasCallStarted] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [streams, setStreams] = useState({});
  const [myStream, setMyStream] = useState(null);
  const [myAudioEnabled, setMyAudioEnabled] = useState(false);
  const [myVideoEnabled, setMyVideoEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [currentUserName, setCurrentUserName] = useState("");
  
  // **NEW STATE: Track if stream is actually active**
  const [isStreamActive, setIsStreamActive] = useState(false);

  // Refs for non-reactive values
  const peersRef = useRef({});
  const myStreamRef = useRef(null);
  const streamsRef = useRef({});
  const reconnectTimeouts = useRef({});

  // Connection quality monitoring
  const connectionQuality = useConnectionQuality(peersRef);

  // **NEW FUNCTION: Check if stream is truly active**
  const checkStreamActive = useCallback((stream) => {
    if (!stream) return false;
    
    // Check if stream is active and has active tracks
    const isActive = stream.active;
    const hasActiveTracks = stream.getTracks().some(track => 
      track.readyState === 'live' && track.enabled
    );
    
    return isActive && hasActiveTracks;
  }, []);

  // **EFFECT: Monitor stream activity**
  useEffect(() => {
    const isActive = checkStreamActive(myStream);
    setIsStreamActive(isActive);
    setHasCallStarted(isActive); // Set call as started if stream is active
    
    console.log('Stream activity check:', {
      myStream: !!myStream,
      streamActive: myStream?.active,
      isActive,
      tracks: myStream?.getTracks()?.map(t => ({ kind: t.kind, readyState: t.readyState, enabled: t.enabled }))
    });
  }, [myStream, checkStreamActive]);

  // Memoized peer configuration
  const peerConfig = useMemo(() => ({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      {
        urls: "turn:numb.viagenie.ca",
        username: "webrtc@live.com",
        credential: "muazkh",
      },
    ],
    iceCandidatePoolSize: 10,
  }), []);

  // Memoized stars array
  const stars = useMemo(() => 
    new Array(4)
      .fill("/icons/star full black.svg")
      .concat("/icons/half black half white.svg"),
    []
  );

  // Memoized products with computed properties
  const memoizedFilteredProducts = useMemo(() => {
    return filteredProducts.map(product => ({
      ...product,
      id: product._id,
    }));
  }, [filteredProducts]);

  const memoizedSimilarProducts = useMemo(() => {
    return similarProducts.map(product => ({
      ...product,
      id: product._id,
    }));
  }, [similarProducts]);

  // Adaptive bitrate based on connection quality
  const adaptVideoBitrate = useCallback((quality) => {
    const constraints = {
      good: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      fair: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24 } },
      poor: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } }
    };
    
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.applyConstraints(constraints[quality]).catch(console.error);
      }
    }
  }, []);

  // Apply adaptive bitrate when quality changes
  useEffect(() => {
    adaptVideoBitrate(connectionQuality);
  }, [connectionQuality, adaptVideoBitrate]);

  // Recreate peer connection on failure
  const recreatePeerConnection = useCallback(async (userId) => {
    if (reconnectTimeouts.current[userId]) {
      clearTimeout(reconnectTimeouts.current[userId]);
    }

    reconnectTimeouts.current[userId] = setTimeout(() => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
        createPeerConnection(userId, false);
      }
    }, 1000);
  }, []);

  // Optimized peer connection creation
  const createPeerConnection = useCallback((userId, isAnswerer) => {
    if (peersRef.current[userId]) {
      return peersRef.current[userId];
    }

    const peer = new RTCPeerConnection(peerConfig);
    
    peer.onconnectionstatechange = () => {
      console.log(`Peer ${userId} connection state:`, peer.connectionState);
      setConnectionState(peer.connectionState);
      
      if (peer.connectionState === 'failed' || peer.connectionState === 'disconnected') {
        recreatePeerConnection(userId);
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      streamsRef.current[userId] = remoteStream;
      setStreams(prev => ({ ...prev, [userId]: remoteStream }));
    };

    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, myStreamRef.current);
      });
    }

    if (!isAnswerer) {
      peer.onnegotiationneeded = async () => {
        try {
          const offer = await peer.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await peer.setLocalDescription(offer);
          if (socket) {
            socket.emit("offer", { to: userId, offer });
          }
        } catch (error) {
          console.error('Error creating offer:', error);
        }
      };
    }

    peersRef.current[userId] = peer;
    return peer;
  }, [peerConfig, socket, recreatePeerConnection]);

  // Updated Socket event handlers to handle user names
  const socketHandlers = useMemo(() => ({
    handleUserJoined: ({ userId, users, userCount, userNames: names }) => {
      console.log('User joined:', userId, 'Total users:', userCount);
      setUserCount(userCount || users.length);
      
      // Update user names
      if (names) {
        setUserNames(names);
      }
      
      const newUsers = users.filter(id => 
        id !== socket.id && !peersRef.current[id]
      );
      
      newUsers.forEach(id => {
        setTimeout(() => createPeerConnection(id, false), 100 * Math.random());
      });
    },

    handleUserLeft: ({ userId, userCount }) => {
      console.log('User left:', userId);
      setUserCount(userCount);
      
      // Remove user name
      setUserNames(prev => {
        const { [userId]: removed, ...rest } = prev;
        return rest;
      });
      
      const peer = peersRef.current[userId];
      if (peer) {
        peer.close();
        delete peersRef.current[userId];
      }
      
      if (streamsRef.current[userId]) {
        delete streamsRef.current[userId];
        setStreams(prev => {
          const { [userId]: removed, ...rest } = prev;
          return rest;
        });
      }
      
      if (reconnectTimeouts.current[userId]) {
        clearTimeout(reconnectTimeouts.current[userId]);
        delete reconnectTimeouts.current[userId];
      }
    },

    handleOffer: async ({ from, offer }) => {
      try {
        const peer = createPeerConnection(from, true);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        if (socket) {
          socket.emit("answer", { to: from, answer });
        }
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    },

    handleAnswer: async ({ from, answer }) => {
      try {
        const peer = peersRef.current[from];
        if (peer && peer.signalingState === 'have-local-offer') {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    },

    handleIceCandidate: async ({ from, candidate }) => {
      try {
        const peer = peersRef.current[from];
        if (peer && peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    },

    handleRoomFull: () => {
      alert('Room is full. Please try again later.');
      router.push('/liveroom');
    }
  }), [socket, router, createPeerConnection]);

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      setLoading(true);
      const constraints = {
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30, max: 30 }
        },
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;
      setMyStream(stream);
      setMyAudioEnabled(true);
      setMyVideoEnabled(true);
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        myStreamRef.current = audioStream;
        setMyStream(audioStream);
        setMyAudioEnabled(true);
        return audioStream;
      } catch (audioError) {
        console.error('Error accessing audio:', audioError);
        throw audioError;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced API calls
  const debouncedFetchProducts = useCallback(
    debounce(async (searchParams) => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getVEFilter`;
        const response = await axios.post(apiUrl, searchParams, {
          headers: { "Content-Type": "application/json" },
        });
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    }, 300),
    []
  );

  const debouncedFetchSimilarProducts = useCallback(
    debounce(async (category) => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fetchProductsByCategory/${category}`;
        const response = await axios.get(apiUrl);
        setSimilarProducts(response.data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    }, 300),
    []
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear timeouts
    Object.values(reconnectTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    reconnectTimeouts.current = {};

    // Close all peer connections
    Object.values(peersRef.current).forEach(peer => {
      if (peer.connectionState !== 'closed') {
        peer.close();
      }
    });
    peersRef.current = {};

    // Stop media tracks
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => track.stop());
      myStreamRef.current = null;
    }

    // Clear streams and names
    streamsRef.current = {};
    setStreams({});
    setMyStream(null);
    setUserNames({});
    setIsStreamActive(false);
    setHasCallStarted(false);

    // Leave socket room
    if (socket) {
      socket.emit("leave-room", { roomId });
    }
  }, [roomId, socket]);

  // Socket event listeners setup
  useEffect(() => {
    if (!socket) return;

    const {
      handleUserJoined,
      handleUserLeft,
      handleOffer,
      handleAnswer,
      handleIceCandidate,
      handleRoomFull
    } = socketHandlers;

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("room-full", handleRoomFull);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("room-full", handleRoomFull);
    };
  }, [socket, socketHandlers]);

  // Updated initialization with user name
  useEffect(() => {
    const init = async () => {
      // Check if user should be in this room
      if (sessionStorage.getItem("roomId") !== roomId) {
        router.push("/liveroom");
        return;
      }

      // Get just the user name
      const userName = sessionStorage.getItem("userName") || `User ${Date.now()}`;
      setCurrentUserName(userName);

      // Redirect if virtual experience data exists
      if (x.length > 0) {
        router.push("/virtualexperience/category");
        return;
      }

      try {
        await initializeMedia();
        if (socket) {
          socket.emit("join-room", { 
            roomId, 
            userInfo: { displayName: userName }
          });
        }
      } catch (error) {
        console.error('Failed to initialize media:', error);
      }
    };

    init();
  }, [roomId, socket, router, x, initializeMedia]);

  // Fetch products when component mounts or data changes
  useEffect(() => {
    if (x.length > 0) {
      debouncedFetchProducts(x);
      if (x.category) {
        debouncedFetchSimilarProducts(x.category);
      }
    }
  }, [x, debouncedFetchProducts, debouncedFetchSimilarProducts]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const exitCall = useCallback(() => {
    cleanup();
    setConnectionState('disconnected');
  }, [cleanup]);

  const rejoinCall = useCallback(async () => {
    try {
      await initializeMedia();
      if (socket && currentUserName) {
        socket.emit("join-room", { 
          roomId, 
          userInfo: { displayName: currentUserName }
        });
      }
    } catch (error) {
      console.error('Failed to rejoin call:', error);
    }
  }, [initializeMedia, roomId, socket, currentUserName]);

  const toggleAudio = useCallback(() => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setMyAudioEnabled(track.enabled);
      });
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setMyVideoEnabled(track.enabled);
      });
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      screenStream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      setIsScreenSharing(true);

      if (myStreamRef.current) {
        const videoTrack = myStreamRef.current.getVideoTracks();
        if (videoTrack) {
          myStreamRef.current.removeTrack(videoTrack);
          videoTrack.stop();
        }
        myStreamRef.current.addTrack(screenStream.getVideoTracks());

        // Update peer connections
        Object.values(peersRef.current).forEach((peer) => {
          const sender = peer
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks());
          }
        });
      }
    } catch (error) {
      console.error("Error sharing screen: ", error);
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    setIsScreenSharing(false);
    exitCall();
    setTimeout(() => rejoinCall(), 100);
  }, [exitCall, rejoinCall]);

  const handleHome = useCallback(() => {
    exitCall();
    router.push("/");
  }, [exitCall, router]);

  // Render video component
  const VideoComponent = useCallback(({ stream, className, muted = false }) => (
    <video
      className={className}
      autoPlay
      playsInline
      muted={muted}
      ref={(video) => {
        if (video && video.srcObject !== stream) {
          video.srcObject = stream;
        }
      }}
    />
  ), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Initializing media...</div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="sm:px-4 flex px-[20px] h-screen py-4 flex-col md:flex-row overflow-y-hidden">
        {/* Video Section */}
        <div className="relative w-full h-full md:w-[70%] bg-black py-4 border-2 border-black">
          {/* Connection Quality Indicator */}
          <div className="absolute top-2 left-2 z-10">
            <div className={`px-2 py-1 rounded text-xs text-white ${
              connectionQuality === 'good' ? 'bg-green-500' :
              connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {connectionQuality.toUpperCase()} ({userCount} users)
            </div>
          </div>

          {/* My Video Stream with Name */}
          {myStream && (
            <div className="relative w-full h-full">
              <VideoComponent 
                stream={myStream}
                className="w-full h-full"
                muted={true}
              />
              {/* My name overlay */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                {currentUserName || "You"}
              </div>
            </div>
          )}

          {/* Mobile Product Slider */}
          {memoizedFilteredProducts && memoizedFilteredProducts.length > 0 && (
            <div className="sticky md:hidden bottom-24">
              <LiveRoomProductSlider products={memoizedFilteredProducts} />
            </div>
          )}

          {/* **FIXED Control Buttons Logic** */}
          <div className="absolute bottom-8 w-full flex gap-2 justify-center">
            <button
              onClick={toggleAudio}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 ${
                myAudioEnabled ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
              }`}
            >
              <Image
                loading="lazy"
                src={myAudioEnabled ? "/callingicon/ic_addaudio.svg" : "/callingicon/ic_removeaudio.svg"}
                alt={myAudioEnabled ? "Mute" : "Unmute"}
                width={10}
                height={10}
                className="object-cover w-full"
              />
            </button>

            <button
              onClick={toggleVideo}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 ${
                myVideoEnabled ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
              }`}
            >
              <Image
                loading="lazy"
                src={myVideoEnabled ? "/callingicon/ic_advideo.svg" : "/callingicon/ic_removevideo.svg"}
                alt={myVideoEnabled ? "Turn off video" : "Turn on video"}
                width={10}
                height={10}
                className="object-cover w-full"
              />
            </button>

            {/* **CORRECTED BUTTON LOGIC: Check if stream is truly active** */}
            {isStreamActive ? (
              // Stream is active - show exit button
              <button
                onClick={exitCall}
                className="bg-red-500 hover:bg-red-400 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10"
              >
                Exit
              </button>
            ) : (
              // No active stream - show join button
              <button
                onClick={rejoinCall}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
              >
                Join Call
              </button>
            )}

            <button
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 ${
                isScreenSharing ? 'bg-orange-500 hover:bg-orange-400' : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              <Image
                loading="lazy"
                src={isScreenSharing ? "/callingicon/ic_removesharescreen.svg" : "/callingicon/ic_adsharescreen.svg"}
                alt={isScreenSharing ? "Stop sharing" : "Share screen"}
                width={10}
                height={10}
                className="object-cover w-full"
              />
            </button>
          </div>

          {/* Peer Video Streams with Names */}
          <div className="absolute w-[20%] top-0 right-0 max-h-full overflow-y-auto">
            {Object.entries(streams).map(([key, stream]) => (
              <div key={key} className="z-50 relative mb-2 rounded-lg shadow-lg">
                <VideoComponent 
                  stream={stream}
                  className="w-full rounded-lg"
                />
                {/* User name overlay */}
                <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium truncate text-center">
                  {userNames[key] || `User ${key.slice(-4)}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="hidden relative md:flex flex-col w-full md:w-[30%] pl-4">
          <div className="relative w-full overflow-y-scroll h-[100%]">
            {/* Home Button */}
            <button
              onClick={handleHome}
              className="absolute top-0 right-2 bg-black text-white px-2 py-1 rounded-md hover:bg-gray-500 font-semibold cursor-pointer z-10"
            >
              Home
            </button>

            {/* Related Products */}
            <div>
              <h1 className="text-2xl font-semibold mb-2">Related Products</h1>
              {memoizedFilteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 w-full h-full fade-in">
                  {memoizedFilteredProducts.map((product, idx) => (
                    <LiveRoomProductCard
                      key={`filtered-${product.id}-${idx}`}
                      productTitle={product.productTitle}
                      price={product.perUnitPrice}
                      demandtype={product.demandtype}
                      specialprice={product.specialprice}
                      desc={product.productTitle}
                      imgSrc={product.images}
                      rating={product.ratings}
                      id={product.id}
                      category={product.category}
                      productId={product.productId}
                      ratings={product.ratings}
                      stars={stars}
                      productDescription={product.productDescription}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No related products found</div>
              )}
            </div>

            {/* Similar Products */}
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">Similar Products</h2>
              {memoizedSimilarProducts.length > 0 ? (
                <div className="grid grid-cols-1 w-full h-full fade-in">
                  {memoizedSimilarProducts.map((product, idx) => (
                    <LiveRoomProductCard
                      key={`similar-${product.id}-${idx}`}
                      productTitle={product.productTitle}
                      price={product.perUnitPrice}
                      demandtype={product.demandtype}
                      specialprice={product.specialprice}
                      desc={product.productTitle}
                      imgSrc={product.images}
                      rating={product.ratings}
                      id={product.id}
                      category={product.category}
                      productId={product.productId}
                      ratings={product.ratings}
                      stars={stars}
                      productDescription={product.productDescription}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No similar products found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
