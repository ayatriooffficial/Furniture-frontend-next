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

// Dynamic constants based on network conditions
const getConnectionConstants = (networkQuality, rtt = 0) => {
  const isDistant = rtt > 200 || networkQuality === 'poor';
  
  return {
    MAX_RETRY_ATTEMPTS: isDistant ? 5 : 3,        
    BASE_RETRY_DELAY: isDistant ? 3000 : 2000,       
    CONNECTION_TIMEOUT: isDistant ? 30000 : 15000,    
    ICE_GATHERING_TIMEOUT: isDistant ? 25000 : 15000, 
    ICE_RESTART_DELAY: isDistant ? 5000 : 3000,      
    RECONNECT_DELAY: isDistant ? 8000 : 5000,
  };
};

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

// Enhanced network quality detection hook with RTT
const useNetworkQuality = () => {
  const [networkQuality, setNetworkQuality] = useState('unknown');
  const [rtt, setRtt] = useState(0);
  
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateNetworkInfo = () => {
        const { effectiveType, downlink, rtt: connectionRtt } = connection;
        setRtt(connectionRtt || 0);
        
        if (effectiveType === '4g' && downlink > 5 && connectionRtt < 100) {
          setNetworkQuality('excellent');
        } else if (effectiveType === '4g' && downlink > 2 && connectionRtt < 200) {
          setNetworkQuality('good');
        } else if (effectiveType === '3g' || (downlink > 2 && connectionRtt < 200)) {
          setNetworkQuality('good');
        } else {
          setNetworkQuality('poor');
        }
      };
      
      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);
  
  return { networkQuality, rtt };
};

// Connection quality hook
const useConnectionQuality = (peersRef) => {
  const [quality, setQuality] = useState('good');
  
  useEffect(() => {
    const checkQuality = async () => {
      const peers = Object.values(peersRef.current);
      if (peers.length === 0) return;
      
      try {
        let totalLossRate = 0;
        let peerCount = 0;
        
        for (const peer of peers) {
          if (peer.connectionState === 'connected') {
            const stats = await peer.getStats();
            stats.forEach((report) => {
              if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
                const packetsLost = report.packetsLost || 0;
                const packetsReceived = report.packetsReceived || 0;
                const lossRate = packetsLost / (packetsLost + packetsReceived);
                totalLossRate += lossRate;
                peerCount++;
              }
            });
          }
        }
        
        if (peerCount > 0) {
          const avgLossRate = totalLossRate / peerCount;
          if (avgLossRate > 0.05) {
            setQuality('poor');
          } else if (avgLossRate > 0.02) {
            setQuality('fair');
          } else {
            setQuality('good');
          }
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

// Loading Spinner Component
const LoadingSpinner = ({ text = "Connecting to peers..." }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  </div>
);

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
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // NEW: Peer connection loading state
  const [peerConnectionLoading, setPeerConnectionLoading] = useState({});
  const [pendingConnections, setPendingConnections] = useState(new Set());

  // Refs for non-reactive values
  const peersRef = useRef({});
  const myStreamRef = useRef(null);
  const streamsRef = useRef({});
  const reconnectTimeouts = useRef({});
  const retryAttempts = useRef({});
  const connectionTimeouts = useRef({});

  // Enhanced hooks
  const { networkQuality, rtt } = useNetworkQuality();
  const connectionQuality = useConnectionQuality(peersRef);

  // Get dynamic constants based on network conditions
  const constants = useMemo(() => 
    getConnectionConstants(networkQuality, rtt), 
    [networkQuality, rtt]
  );

  // NEW: Check if any peer is still connecting
  const anyPeerConnecting = useMemo(() => {
    return Object.values(peerConnectionLoading).some(Boolean) || 
           pendingConnections.size > 0 ||
           Object.values(connectionStatus).some(status => 
             status === 'connecting' || status.includes('retrying')
           );
  }, [peerConnectionLoading, pendingConnections, connectionStatus]);

  // NEW: Helper functions for connection loading state
  const startPeerConnectionLoading = useCallback((peerId) => {
    setPeerConnectionLoading(prev => ({ ...prev, [peerId]: true }));
    setPendingConnections(prev => new Set(prev).add(peerId));
    console.log(`Started connecting to peer ${peerId}`);
  }, []);

  const finishPeerConnectionLoading = useCallback((peerId) => {
    setPeerConnectionLoading(prev => ({ ...prev, [peerId]: false }));
    setPendingConnections(prev => {
      const newSet = new Set(prev);
      newSet.delete(peerId);
      return newSet;
    });
    console.log(`Finished connecting to peer ${peerId}`);
  }, []);

  // DYNAMIC peer configuration - ADAPTS to network conditions
  const peerConfig = useMemo(() => {
    const isDistant = rtt > 200 || networkQuality === 'poor';
    
    console.log(`Configuring for ${isDistant ? 'distant' : 'nearby'} connection (RTT: ${rtt}ms, Quality: ${networkQuality})`);

    if (isDistant) {
      // Configuration optimized for distant connections
      return {
        iceServers: [
          // TURN servers FIRST for long distance
          {
            urls: [
              "turn:relay1.expressturn.com:3478",
              "turns:relay1.expressturn.com:5349"
            ],
            username: "efJT4DT8PZ82L5ZH2Y",
            credential: "O4f5xoWnWPBtkXRE"
          },
          {
            urls: [
              "turn:numb.viagenie.ca:3478",
              "turns:numb.viagenie.ca:5349"
            ],
            username: "webrtc@live.com",
            credential: "muazkh",
          },
          {
            urls: [
              "turn:openrelay.metered.ca:80",
              "turn:openrelay.metered.ca:443",
              "turns:openrelay.metered.ca:443"
            ],
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          // STUN servers after TURN
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 20, // More candidates for distant connections
        iceTransportPolicy: 'all',
        iceGatheringTimeout: constants.ICE_GATHERING_TIMEOUT,
      };
    } else {
      // Configuration optimized for nearby connections
      return {
        iceServers: [
          // STUN servers FIRST for nearby connections (faster)
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          // TURN servers as fallback
          {
            urls: [
              "turn:relay1.expressturn.com:3478",
              "turns:relay1.expressturn.com:5349"
            ],
            username: "efJT4DT8PZ82L5ZH2Y",
            credential: "O4f5xoWnWPBtkXRE"
          },
          {
            urls: [
              "turn:numb.viagenie.ca:3478",
              "turns:numb.viagenie.ca:5349"
            ],
            username: "webrtc@live.com",
            credential: "muazkh",
          },
        ],
        bundlePolicy: 'balanced', // Balanced for nearby connections
        rtcpMuxPolicy: 'require',
        iceCandidatePoolSize: 10, // Fewer candidates needed
        iceTransportPolicy: 'all',
        iceGatheringTimeout: constants.ICE_GATHERING_TIMEOUT,
      };
    }
  }, [networkQuality, rtt, constants]);

  // Memoized arrays and products
  const stars = useMemo(() => 
    new Array(4)
      .fill("/icons/star full black.svg")
      .concat("/icons/half black half white.svg"),
    []
  );

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

  // Check if stream is truly active
  const checkStreamActive = useCallback((stream) => {
    if (!stream) return false;
    
    const isActive = stream.active;
    const hasActiveTracks = stream.getTracks().some(track => 
      track.readyState === 'live' && track.enabled
    );
    
    return isActive && hasActiveTracks;
  }, []);

  // Monitor stream activity
  useEffect(() => {
    const isActive = checkStreamActive(myStream);
    setIsStreamActive(isActive);
    setHasCallStarted(isActive);
    
    console.log('Stream activity check:', {
      myStream: !!myStream,
      streamActive: myStream?.active,
      isActive,
      tracks: myStream?.getTracks()?.map(t => ({ kind: t.kind, readyState: t.readyState, enabled: t.enabled }))
    });
  }, [myStream, checkStreamActive]);

  // Adaptive bitrate based on connection quality
  const adaptVideoBitrate = useCallback((quality) => {
    const constraints = {
      excellent: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      good: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
      fair: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 24 } },
      poor: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } }
    };
    
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.applyConstraints(constraints[quality] || constraints.fair)
          .catch(error => console.error('Error applying constraints:', error));
      }
    }
  }, []);

  // Apply adaptive bitrate when quality changes
  useEffect(() => {
    adaptVideoBitrate(networkQuality !== 'unknown' ? networkQuality : connectionQuality);
  }, [connectionQuality, networkQuality, adaptVideoBitrate]);

  // Clear all timeouts for a user
  const clearUserTimeouts = useCallback((userId) => {
    if (reconnectTimeouts.current[userId]) {
      clearTimeout(reconnectTimeouts.current[userId]);
      delete reconnectTimeouts.current[userId];
    }
    if (connectionTimeouts.current[userId]) {
      clearTimeout(connectionTimeouts.current[userId]);
      delete connectionTimeouts.current[userId];
    }
  }, []);

  // Enhanced peer connection recreation with dynamic retry limits
  const recreatePeerConnection = useCallback(async (userId) => {
    if (!retryAttempts.current[userId]) {
      retryAttempts.current[userId] = 0;
    }
    
    if (retryAttempts.current[userId] >= constants.MAX_RETRY_ATTEMPTS) {
      console.log(`Max retry attempts (${constants.MAX_RETRY_ATTEMPTS}) reached for user ${userId}`);
      
      setConnectionStatus(prev => ({
        ...prev,
        [userId]: 'failed'
      }));
      
      // NEW: Mark as finished connecting (failed)
      finishPeerConnectionLoading(userId);
      
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      
      clearUserTimeouts(userId);
      delete retryAttempts.current[userId];
      
      return;
    }

    clearUserTimeouts(userId);
    retryAttempts.current[userId]++;
    
    console.log(`Recreating peer connection for ${userId}, attempt ${retryAttempts.current[userId]}/${constants.MAX_RETRY_ATTEMPTS}`);
    
    setConnectionStatus(prev => ({
      ...prev,
      [userId]: `retrying (${retryAttempts.current[userId]}/${constants.MAX_RETRY_ATTEMPTS})`
    }));
    
    // Dynamic exponential backoff
    const delay = constants.BASE_RETRY_DELAY * Math.pow(1.5, retryAttempts.current[userId] - 1);
    
    reconnectTimeouts.current[userId] = setTimeout(() => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      createPeerConnection(userId, false);
    }, delay);
  }, [clearUserTimeouts, constants, finishPeerConnectionLoading]);

  // Enhanced peer connection creation with dynamic timeouts
  const createPeerConnection = useCallback((userId, isAnswerer) => {
    if (peersRef.current[userId]) {
      console.log(`Peer connection already exists for ${userId}`);
      return peersRef.current[userId];
    }

    console.log(`Creating new peer connection for ${userId}, isAnswerer: ${isAnswerer}, network: ${networkQuality}, RTT: ${rtt}ms`);
    
    // NEW: Start connection loading
    startPeerConnectionLoading(userId);
    
    const peer = new RTCPeerConnection(peerConfig);
    
    // Dynamic connection timeout based on network conditions
    connectionTimeouts.current[userId] = setTimeout(() => {
      if (peer.connectionState !== 'connected') {
        console.log(`Connection timeout for user ${userId} after ${constants.CONNECTION_TIMEOUT}ms`);
        recreatePeerConnection(userId);
      }
    }, constants.CONNECTION_TIMEOUT);
    
    // Enhanced connection state handling
    peer.onconnectionstatechange = () => {
      console.log(`Peer ${userId} connection state:`, peer.connectionState);
      setConnectionState(peer.connectionState);
      
      setConnectionStatus(prev => ({
        ...prev,
        [userId]: peer.connectionState
      }));
      
      switch (peer.connectionState) {
        case 'connected':
          console.log(`Successfully connected to user ${userId}`);
          // NEW: Mark as finished connecting (success)
          finishPeerConnectionLoading(userId);
          if (retryAttempts.current[userId]) {
            delete retryAttempts.current[userId];
          }
          clearUserTimeouts(userId);
          break;
          
        case 'failed':
          console.log(`Connection failed for user ${userId}, attempt ${retryAttempts.current[userId] || 0}`);
          clearUserTimeouts(userId);
          recreatePeerConnection(userId);
          break;
          
        case 'disconnected':
          console.log(`Connection disconnected for user ${userId}`);
          // Dynamic wait time based on network conditions
          setTimeout(() => {
            if (peer.connectionState === 'disconnected') {
              recreatePeerConnection(userId);
            }
          }, constants.RECONNECT_DELAY);
          break;
      }
    };

    // ICE connection state monitoring with dynamic restart delay
    peer.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${userId}:`, peer.iceConnectionState);
      
      if (peer.iceConnectionState === 'failed') {
        console.log(`ICE connection failed for user ${userId}, restarting ICE`);
        setTimeout(() => {
          try {
            peer.restartIce();
          } catch (error) {
            console.error('Error restarting ICE:', error);
            recreatePeerConnection(userId);
          }
        }, constants.ICE_RESTART_DELAY);
      }
    };

    // Enhanced ICE candidate handling
    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log(`Sending ICE candidate to ${userId}`);
        socket.emit("ice-candidate", {
          to: userId,
          candidate: event.candidate,
        });
      } else if (!event.candidate) {
        console.log(`ICE gathering complete for ${userId}`);
      }
    };

    // Track handling
    peer.ontrack = (event) => {
      console.log(`Received track from ${userId}`);
      const remoteStream = event.streams[0];
      if (remoteStream) {
        streamsRef.current[userId] = remoteStream;
        setStreams(prev => ({ ...prev, [userId]: remoteStream }));
      }
    };

    // Add local stream tracks
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        console.log(`Adding ${track.kind} track to peer ${userId}`);
        peer.addTrack(track, myStreamRef.current);
      });
    }

    // Negotiation handling for offerer with signaling state checks
    if (!isAnswerer) {
      peer.onnegotiationneeded = async () => {
        try {
          if (peer.signalingState !== 'stable') {
            console.log(`Peer ${userId} not in stable state for negotiation: ${peer.signalingState}`);
            return;
          }
          
          console.log(`Creating offer for ${userId}`);
          const offer = await peer.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          
          await peer.setLocalDescription(offer);
          
          if (socket) {
            socket.emit("offer", { to: userId, offer });
          }
        } catch (error) {
          console.error(`Error creating offer for ${userId}:`, error);
        }
      };
    }

    peersRef.current[userId] = peer;
    return peer;
  }, [peerConfig, socket, recreatePeerConnection, clearUserTimeouts, networkQuality, rtt, constants, startPeerConnectionLoading, finishPeerConnectionLoading]);

  // Enhanced socket handlers with dynamic staggering
  const socketHandlers = useMemo(() => ({
    handleUserJoined: ({ userId, users, userCount, userNames: names }) => {
      console.log('User joined:', userId, 'Total users:', userCount);
      setUserCount(userCount || users.length);
      
      if (names) {
        setUserNames(names);
      }
      
      const newUsers = users.filter(id => 
        id !== socket.id && !peersRef.current[id]
      );
      
      // Dynamic stagger delay based on network conditions
      const staggerDelay = rtt > 200 ? 500 : 200;
      newUsers.forEach((id, index) => {
        setTimeout(() => {
          createPeerConnection(id, false);
        }, staggerDelay * index);
      });
    },

    handleUserLeft: ({ userId, userCount }) => {
      console.log('User left:', userId);
      setUserCount(userCount);
      
      // NEW: Clean up loading state
      finishPeerConnectionLoading(userId);
      
      setUserNames(prev => {
        const { [userId]: removed, ...rest } = prev;
        return rest;
      });
      
      setConnectionStatus(prev => {
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
      
      clearUserTimeouts(userId);
      if (retryAttempts.current[userId]) {
        delete retryAttempts.current[userId];
      }
    },

    handleOffer: async ({ from, offer }) => {
      try {
        console.log(`Received offer from ${from}`);
        const peer = createPeerConnection(from, true);
        
        if (peer.signalingState !== 'stable') {
          console.log(`Peer ${from} not in stable state, current: ${peer.signalingState}`);
          return;
        }
        
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        
        if (socket) {
          console.log(`Sending answer to ${from}`);
          socket.emit("answer", { to: from, answer });
        }
      } catch (error) {
        console.error(`Error handling offer from ${from}:`, error);
      }
    },

    handleAnswer: async ({ from, answer }) => {
      try {
        console.log(`Received answer from ${from}`);
        const peer = peersRef.current[from];
        if (peer && peer.signalingState === 'have-local-offer') {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.log(`Peer ${from} in unexpected state: ${peer?.signalingState}`);
        }
      } catch (error) {
        console.error(`Error handling answer from ${from}:`, error);
      }
    },

    handleIceCandidate: async ({ from, candidate }) => {
      try {
        console.log(`Received ICE candidate from ${from}`);
        const peer = peersRef.current[from];
        if (peer && peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          console.log(`Cannot add ICE candidate from ${from}, peer not ready`);
        }
      } catch (error) {
        console.error(`Error handling ICE candidate from ${from}:`, error);
      }
    },

    handleRoomFull: () => {
      alert('Room is full. Please try again later.');
      router.push('/liveroom');
    }
  }), [socket, router, createPeerConnection, clearUserTimeouts, rtt, finishPeerConnectionLoading]);

  // Initialize media stream with better error handling
  const initializeMedia = useCallback(async () => {
    try {
      setLoading(true);
      
      const getConstraints = () => {
        const baseConstraints = {
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };
        
        switch (networkQuality) {
          case 'poor':
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: 320 }, 
                height: { ideal: 240 },
                frameRate: { ideal: 15, max: 20 }
              }
            };
          case 'fair':
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                frameRate: { ideal: 24, max: 30 }
              }
            };
          default:
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 720 },
                frameRate: { ideal: 30, max: 30 }
              }
            };
        }
      };
      
      const constraints = getConstraints();
      console.log('Requesting media with constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      myStreamRef.current = stream;
      setMyStream(stream);
      setMyAudioEnabled(true);
      setMyVideoEnabled(true);
      
      console.log('Media initialized successfully');
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      try {
        console.log('Attempting audio-only fallback');
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        myStreamRef.current = audioStream;
        setMyStream(audioStream);
        setMyAudioEnabled(true);
        setMyVideoEnabled(false);
        return audioStream;
      } catch (audioError) {
        console.error('Error accessing audio:', audioError);
        throw audioError;
      }
    } finally {
      setLoading(false);
    }
  }, [networkQuality]);

  // Debounced API calls (unchanged)
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

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up WebRTC connections...');
    
    // NEW: Clear all loading states
    setPeerConnectionLoading({});
    setPendingConnections(new Set());
    
    Object.values(reconnectTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    reconnectTimeouts.current = {};
    
    Object.values(connectionTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    connectionTimeouts.current = {};
    
    retryAttempts.current = {};

    Object.values(peersRef.current).forEach(peer => {
      if (peer.connectionState !== 'closed') {
        peer.close();
      }
    });
    peersRef.current = {};

    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      myStreamRef.current = null;
    }

    streamsRef.current = {};
    setStreams({});
    setMyStream(null);
    setUserNames({});
    setConnectionStatus({});
    setIsStreamActive(false);
    setHasCallStarted(false);
    setConnectionState('disconnected');

    if (socket) {
      socket.emit("leave-room", { roomId });
    }
    
    console.log('Cleanup completed');
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

  // Initialization
  useEffect(() => {
    const init = async () => {
      if (sessionStorage.getItem("roomId") !== roomId) {
        router.push("/liveroom");
        return;
      }

      const userName = sessionStorage.getItem("userName") || `User ${Date.now()}`;
      setCurrentUserName(userName);

      if (x.length > 0) {
        router.push("/virtualexperience/category");
        return;
      }

      try {
        console.log('Initializing room...');
        await initializeMedia();
        
        if (socket) {
          console.log('Joining room...');
          socket.emit("join-room", { 
            roomId, 
            userInfo: { displayName: userName }
          });
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
        alert('Failed to access camera/microphone. Please check permissions and try again.');
      }
    };

    init();
  }, [roomId, socket, router, x, initializeMedia]);

  // Fetch products
  useEffect(() => {
    if (x.length > 0) {
      debouncedFetchProducts(x);
      if (x.category) {
        debouncedFetchSimilarProducts(x.category);
      }
    }
  }, [x, debouncedFetchProducts, debouncedFetchSimilarProducts]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Control functions
  const exitCall = useCallback(() => {
    console.log('Exiting call...');
    cleanup();
  }, [cleanup]);

  const rejoinCall = useCallback(async () => {
    try {
      console.log('Rejoining call...');
      await initializeMedia();
      if (socket && currentUserName) {
        socket.emit("join-room", { 
          roomId, 
          userInfo: { displayName: currentUserName }
        });
      }
    } catch (error) {
      console.error('Failed to rejoin call:', error);
      alert('Failed to rejoin call. Please check your connection and try again.');
    }
  }, [initializeMedia, roomId, socket, currentUserName]);

  const toggleAudio = useCallback(() => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setMyAudioEnabled(track.enabled);
        console.log(`Audio ${track.enabled ? 'enabled' : 'disabled'}`);
      });
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setMyVideoEnabled(track.enabled);
        console.log(`Video ${track.enabled ? 'enabled' : 'disabled'}`);
      });
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      console.log('Starting screen share...');
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      screenStream.getVideoTracks()[0].onended = () => {
        console.log('Screen share ended');
        stopScreenShare();
      };

      setIsScreenSharing(true);

      if (myStreamRef.current) {
        const videoTrack = myStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          myStreamRef.current.removeTrack(videoTrack);
          videoTrack.stop();
        }
        myStreamRef.current.addTrack(screenStream.getVideoTracks()[0]);

        Object.values(peersRef.current).forEach((peer) => {
          const sender = peer
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(screenStream.getVideoTracks()[0])
              .catch(error => console.error('Error replacing track:', error));
          }
        });
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      alert('Failed to start screen sharing. Please try again.');
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    console.log('Stopping screen share...');
    setIsScreenSharing(false);
    exitCall();
    setTimeout(() => rejoinCall(), 1000);
  }, [exitCall, rejoinCall]);

  const handleHome = useCallback(() => {
    exitCall();
    router.push("/");
  }, [exitCall, router]);

  const VideoComponent = useCallback(({ stream, className, muted = false, userId = null }) => (
    <video
      className={className}
      autoPlay
      playsInline
      muted={muted}
      ref={(video) => {
        if (video && video.srcObject !== stream) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            console.log(`Video loaded for ${userId || 'local'}`);
          };
          video.onerror = (error) => {
            console.error(`Video error for ${userId || 'local'}:`, error);
          };
        }
      }}
    />
  ), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl mb-4">Initializing media...</div>
          <div className="text-sm text-gray-400">
            Network Quality: {networkQuality} | RTT: {rtt}ms
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {rtt > 200 ? 'Optimizing for distant connection' : 'Optimizing for nearby connection'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* NEW: Peer Connection Loading Overlay */}
      {anyPeerConnecting && (
        <LoadingSpinner 
          text={`Connecting to ${pendingConnections.size} peer${pendingConnections.size !== 1 ? 's' : ''}...`} 
        />
      )}
      
      <div className="sm:px-4 flex px-[20px] h-screen py-4 flex-col md:flex-row overflow-y-hidden">
        {/* Video Section */}
        <div className="relative w-full h-full md:w-[70%] bg-black py-4 border-2 border-black">
          {/* Enhanced Status Indicators */}
          <div className="absolute top-2 left-2 z-10 space-y-2">
            <div className={`px-2 py-1 rounded text-xs text-white ${
              connectionQuality === 'good' ? 'bg-green-500' :
              connectionQuality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              Quality: {connectionQuality.toUpperCase()} ({userCount} users)
            </div>
            
            <div className={`px-2 py-1 rounded text-xs text-white ${
              networkQuality === 'excellent' ? 'bg-green-500' :
              networkQuality === 'good' ? 'bg-blue-500' :
              networkQuality === 'fair' ? 'bg-yellow-500' : 
              networkQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              Network: {networkQuality.toUpperCase()} | RTT: {rtt}ms
            </div>

            {/* Connection Mode Indicator */}
            <div className={`px-2 py-1 rounded text-xs text-white ${
              rtt > 200 ? 'bg-orange-600' : 'bg-green-600'
            }`}>
              {rtt > 200 ? 'Distant Mode' : 'Nearby Mode'}
            </div>

            {/* NEW: Connection Progress Indicator */}
            {anyPeerConnecting && (
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                Connecting: {pendingConnections.size} peer{pendingConnections.size !== 1 ? 's' : ''}
              </div>
            )}
            
            {Object.keys(connectionStatus).length > 0 && (
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs max-w-xs">
                Connections: {Object.entries(connectionStatus).map(([userId, status]) => 
                  `${userNames[userId]?.slice(0, 8) || userId.slice(-4)}: ${status}`
                ).join(', ')}
              </div>
            )}
          </div>

          {/* My Video Stream */}
          {myStream && (
            <div className="relative w-full h-full">
              <VideoComponent 
                stream={myStream}
                className="w-full h-full object-cover"
                muted={true}
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                {currentUserName || "You"} {isScreenSharing && "(Sharing Screen)"}
              </div>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {!myAudioEnabled && (
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <Image src="/callingicon/ic_removeaudio.svg" alt="Muted" width={16} height={16} />
                  </div>
                )}
                {!myVideoEnabled && (
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <Image src="/callingicon/ic_removevideo.svg" alt="Video Off" width={16} height={16} />
                  </div>
                )}
              </div>
            </div>
          )}

          {!myStream && !loading && (
            <div className="w-full h-full flex items-center justify-center text-white text-xl">
              <div className="text-center">
                <div className="mb-4">Camera/Microphone not available</div>
                <button
                  onClick={rejoinCall}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {memoizedFilteredProducts && memoizedFilteredProducts.length > 0 && (
            <div className="sticky md:hidden bottom-24">
              <LiveRoomProductSlider products={memoizedFilteredProducts} />
            </div>
          )}

          {/* Control Buttons */}
          <div className="absolute bottom-8 w-full flex gap-2 justify-center">
            <button
              onClick={toggleAudio}
              disabled={!myStream}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 disabled:opacity-50 ${
                myAudioEnabled ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
              }`}
              title={myAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
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
              disabled={!myStream}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 disabled:opacity-50 ${
                myVideoEnabled ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
              }`}
              title={myVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}
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

            {isStreamActive ? (
              <button
                onClick={exitCall}
                className="bg-red-500 hover:bg-red-400 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10"
                title="Exit Call"
              >
                Exit
              </button>
            ) : (
              <button
                onClick={rejoinCall}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                title="Join Call"
              >
                Join Call
              </button>
            )}

            <button
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              disabled={!myStream}
              className={`p-2 text-xs text-center text-white font-medium shadow-sm rounded-full w-10 h-10 disabled:opacity-50 ${
                isScreenSharing ? 'bg-orange-500 hover:bg-orange-400' : 'bg-blue-500 hover:bg-blue-400'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
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

          {/* Peer Video Streams */}
          <div className="absolute w-[20%] top-0 right-0 max-h-full overflow-y-auto">
            {Object.entries(streams).map(([userId, stream]) => (
              <div key={userId} className="z-50 relative mb-2 rounded-lg shadow-lg">
                <VideoComponent 
                  stream={stream}
                  className="w-full rounded-lg"
                  userId={userId}
                />
                <div className="absolute bottom-1 left-1 right-1 space-y-1">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium truncate text-center">
                    {userNames[userId] || `User ${userId.slice(-4)}`}
                  </div>
                  {connectionStatus[userId] && connectionStatus[userId] !== 'connected' && (
                    <div className={`text-xs text-center px-1 py-0.5 rounded ${
                      connectionStatus[userId].includes('retrying') ? 'bg-yellow-500' :
                      connectionStatus[userId] === 'failed' ? 'bg-red-500' : 
                      connectionStatus[userId] === 'connecting' ? 'bg-blue-500' : 'bg-gray-500'
                    } text-white`}>
                      {connectionStatus[userId]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section (unchanged) */}
        <div className="hidden relative md:flex flex-col w-full md:w-[30%] pl-4">
          <div className="relative w-full overflow-y-scroll h-[100%]">
            <button
              onClick={handleHome}
              className="absolute top-0 right-2 bg-black text-white px-2 py-1 rounded-md hover:bg-gray-500 font-semibold cursor-pointer z-10"
            >
              Home
            </button>

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
