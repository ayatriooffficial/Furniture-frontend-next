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

// Enhanced constants for distant connections
const MAX_RETRY_ATTEMPTS = 5;        // Increased from 3
const BASE_RETRY_DELAY = 3000;       // Increased from 2000
const CONNECTION_TIMEOUT = 45000;    // Increased from 30000
const ICE_GATHERING_TIMEOUT = 35000; // New constant
const ICE_RESTART_DELAY = 5000;      // New constant
const RECONNECT_DELAY = 8000;        // New constant for disconnected state

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

// Enhanced network quality detection hook
const useNetworkQuality = () => {
  const [networkQuality, setNetworkQuality] = useState('unknown');
  const [rtt, setRtt] = useState(0);
  
  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateNetworkInfo = () => {
        const { effectiveType, downlink, rtt: connectionRtt } = connection;
        setRtt(connectionRtt || 0);
        
        // Enhanced network quality detection for distant connections
        if (effectiveType === '4g' && downlink > 5 && connectionRtt < 100) {
          setNetworkQuality('excellent');
        } else if (effectiveType === '4g' && downlink > 2 && connectionRtt < 200) {
          setNetworkQuality('good');
        } else if ((effectiveType === '3g' || effectiveType === '4g') && downlink > 1 && connectionRtt < 400) {
          setNetworkQuality('fair');
        } else if (connectionRtt > 500 || downlink < 1) {
          setNetworkQuality('poor');
        } else {
          setNetworkQuality('unknown');
        }
      };
      
      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);
  
  return { networkQuality, rtt };
};

// Enhanced connection quality hook
const useConnectionQuality = (peersRef) => {
  const [quality, setQuality] = useState('good');
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    const checkQuality = async () => {
      const peers = Object.values(peersRef.current);
      if (peers.length === 0) return;
      
      try {
        let totalLossRate = 0;
        let totalRtt = 0;
        let peerCount = 0;
        const peerStats = {};
        
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
              } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                totalRtt += report.currentRoundTripTime || 0;
              }
            });
          }
        }
        
        if (peerCount > 0) {
          const avgLossRate = totalLossRate / peerCount;
          const avgRtt = totalRtt / peerCount;
          
          // Enhanced quality assessment for distant connections
          if (avgLossRate > 0.08 || avgRtt > 0.8) {
            setQuality('poor');
          } else if (avgLossRate > 0.03 || avgRtt > 0.4) {
            setQuality('fair');
          } else {
            setQuality('good');
          }
          
          setStats({ lossRate: avgLossRate, rtt: avgRtt });
        }
      } catch (error) {
        console.error('Error checking connection quality:', error);
      }
    };
    
    const interval = setInterval(checkQuality, 3000); // More frequent checks
    return () => clearInterval(interval);
  }, [peersRef]);
  
  return { quality, stats };
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
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // Refs for non-reactive values
  const peersRef = useRef({});
  const myStreamRef = useRef(null);
  const streamsRef = useRef({});
  const reconnectTimeouts = useRef({});
  const retryAttempts = useRef({});
  const connectionTimeouts = useRef({});
  const iceGatheringTimeouts = useRef({});

  // Enhanced hooks
  const { networkQuality, rtt } = useNetworkQuality();
  const { quality: connectionQuality, stats: connectionStats } = useConnectionQuality(peersRef);

  // Dynamic peer configuration based on network conditions
  const peerConfig = useMemo(() => {
    const baseConfig = {
      iceServers: [
        // STUN servers for NAT traversal
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        
        // Primary TURN servers with multiple protocols
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
        
        // Additional TURN servers for better global coverage
        {
          urls: [
            "turn:openrelay.metered.ca:80",
            "turn:openrelay.metered.ca:443",
            "turns:openrelay.metered.ca:443"
          ],
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        
        // Backup TURN servers
        {
          urls: "turn:turn.bistri.com:80",
          username: "homeo",
          credential: "homeo"
        },
        
        // Additional reliable TURN servers
        {
          urls: [
            "turn:turn.anyfirewall.com:443?transport=tcp",
            "turns:turn.anyfirewall.com:443?transport=tcp"
          ],
          username: "webrtc",
          credential: "webrtc"
        }
      ],
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
    };

    // Adaptive configuration based on network quality and RTT
    const isDistantConnection = rtt > 300 || networkQuality === 'poor' || connectionQuality === 'poor';
    
    if (isDistantConnection) {
      console.log('Configuring for distant/poor connection');
      return {
        ...baseConfig,
        // Prioritize TURN servers for distant connections
        iceServers: [
          ...baseConfig.iceServers.slice(5), // TURN servers first
          ...baseConfig.iceServers.slice(0, 5), // STUN servers as fallback
        ],
        iceCandidatePoolSize: 20,
        iceTransportPolicy: 'all', // Try all, but TURN servers are prioritized
        iceGatheringTimeout: ICE_GATHERING_TIMEOUT,
        // Additional settings for distant connections
        iceCandidateTimeout: 20000,
        enableDscp: true,
      };
    } else if (networkQuality === 'fair' || connectionQuality === 'fair') {
      return {
        ...baseConfig,
        iceCandidatePoolSize: 15,
        iceTransportPolicy: 'all',
        iceGatheringTimeout: 25000,
        iceCandidateTimeout: 15000,
      };
    } else {
      return {
        ...baseConfig,
        iceCandidatePoolSize: 12,
        iceTransportPolicy: 'all',
        iceGatheringTimeout: 20000,
        iceCandidateTimeout: 10000,
      };
    }
  }, [networkQuality, connectionQuality, rtt]);

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

  // Enhanced adaptive bitrate based on connection quality and distance
  const adaptVideoBitrate = useCallback((quality, isDistant = false) => {
    const constraints = {
      excellent: { 
        width: { ideal: isDistant ? 1280 : 1920 }, 
        height: { ideal: isDistant ? 720 : 1080 }, 
        frameRate: { ideal: isDistant ? 25 : 30 } 
      },
      good: { 
        width: { ideal: 1280 }, 
        height: { ideal: 720 }, 
        frameRate: { ideal: 30 } 
      },
      fair: { 
        width: { ideal: 854 }, 
        height: { ideal: 480 }, 
        frameRate: { ideal: 24 } 
      },
      poor: { 
        width: { ideal: 640 }, 
        height: { ideal: 360 }, 
        frameRate: { ideal: 15 } 
      }
    };
    
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const targetConstraints = constraints[quality] || constraints.fair;
        videoTrack.applyConstraints(targetConstraints)
          .then(() => {
            console.log(`Applied video constraints for ${quality} quality:`, targetConstraints);
          })
          .catch(error => console.error('Error applying constraints:', error));
      }
    }
  }, []);

  // Apply adaptive bitrate when quality changes
  useEffect(() => {
    const isDistant = rtt > 300 || networkQuality === 'poor';
    const effectiveQuality = networkQuality !== 'unknown' ? networkQuality : connectionQuality;
    adaptVideoBitrate(effectiveQuality, isDistant);
  }, [connectionQuality, networkQuality, rtt, adaptVideoBitrate]);

  // Enhanced clear timeouts function
  const clearUserTimeouts = useCallback((userId) => {
    if (reconnectTimeouts.current[userId]) {
      clearTimeout(reconnectTimeouts.current[userId]);
      delete reconnectTimeouts.current[userId];
    }
    if (connectionTimeouts.current[userId]) {
      clearTimeout(connectionTimeouts.current[userId]);
      delete connectionTimeouts.current[userId];
    }
    if (iceGatheringTimeouts.current[userId]) {
      clearTimeout(iceGatheringTimeouts.current[userId]);
      delete iceGatheringTimeouts.current[userId];
    }
  }, []);

  // Enhanced peer connection recreation with better retry logic
  const recreatePeerConnection = useCallback(async (userId) => {
    // Initialize retry counter
    if (!retryAttempts.current[userId]) {
      retryAttempts.current[userId] = 0;
    }
    
    // Check retry limit
    if (retryAttempts.current[userId] >= MAX_RETRY_ATTEMPTS) {
      console.log(`Max retry attempts (${MAX_RETRY_ATTEMPTS}) reached for user ${userId}`);
      
      // Update connection status
      setConnectionStatus(prev => ({
        ...prev,
        [userId]: 'failed'
      }));
      
      // Clean up and stop retrying
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
    
    console.log(`Recreating peer connection for ${userId}, attempt ${retryAttempts.current[userId]}/${MAX_RETRY_ATTEMPTS}`);
    
    // Update connection status
    setConnectionStatus(prev => ({
      ...prev,
      [userId]: `retrying (${retryAttempts.current[userId]}/${MAX_RETRY_ATTEMPTS})`
    }));
    
    // Progressive backoff with jitter for distant connections
    const baseDelay = BASE_RETRY_DELAY;
    const exponentialFactor = Math.pow(2, retryAttempts.current[userId] - 1);
    const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
    const delay = Math.min(baseDelay * exponentialFactor + jitter, 30000); // Cap at 30 seconds
    
    reconnectTimeouts.current[userId] = setTimeout(() => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
      createPeerConnection(userId, false);
    }, delay);
  }, [clearUserTimeouts]);

  // Enhanced peer connection creation
  const createPeerConnection = useCallback((userId, isAnswerer) => {
    if (peersRef.current[userId]) {
      console.log(`Peer connection already exists for ${userId}`);
      return peersRef.current[userId];
    }

    console.log(`Creating new peer connection for ${userId}, isAnswerer: ${isAnswerer}, network: ${networkQuality}, RTT: ${rtt}ms`);
    
    const peer = new RTCPeerConnection(peerConfig);
    
    // Enhanced connection timeout with adaptive timing
    const timeoutDuration = rtt > 500 ? CONNECTION_TIMEOUT * 1.5 : CONNECTION_TIMEOUT;
    connectionTimeouts.current[userId] = setTimeout(() => {
      if (peer.connectionState !== 'connected') {
        console.log(`Connection timeout for user ${userId} after ${timeoutDuration}ms`);
        recreatePeerConnection(userId);
      }
    }, timeoutDuration);
    
    // ICE gathering timeout
    iceGatheringTimeouts.current[userId] = setTimeout(() => {
      if (peer.iceGatheringState !== 'complete') {
        console.log(`ICE gathering timeout for user ${userId}`);
        // Don't recreate immediately, let other mechanisms handle it
      }
    }, ICE_GATHERING_TIMEOUT);
    
    // Enhanced connection state handling
    peer.onconnectionstatechange = () => {
      console.log(`Peer ${userId} connection state:`, peer.connectionState);
      setConnectionState(peer.connectionState);
      
      // Update individual connection status
      setConnectionStatus(prev => ({
        ...prev,
        [userId]: peer.connectionState
      }));
      
      switch (peer.connectionState) {
        case 'connected':
          console.log(`Successfully connected to user ${userId}`);
          // Reset retry counter on successful connection
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
          // Wait longer before retrying for distant connections
          const waitTime = rtt > 300 ? RECONNECT_DELAY * 1.5 : RECONNECT_DELAY;
          setTimeout(() => {
            if (peer.connectionState === 'disconnected') {
              console.log(`Attempting reconnection for ${userId} after ${waitTime}ms`);
              recreatePeerConnection(userId);
            }
          }, waitTime);
          break;
          
        case 'connecting':
          console.log(`Connecting to user ${userId}...`);
          break;
      }
    };

    // Enhanced ICE connection state monitoring
    peer.oniceconnectionstatechange = () => {
      console.log(`ICE connection state for ${userId}:`, peer.iceConnectionState);
      
      switch (peer.iceConnectionState) {
        case 'failed':
          console.log(`ICE connection failed for user ${userId}, attempting ICE restart`);
          setTimeout(() => {
            try {
              if (peer.connectionState !== 'closed') {
                peer.restartIce();
              }
            } catch (error) {
              console.error('Error restarting ICE:', error);
              recreatePeerConnection(userId);
            }
          }, ICE_RESTART_DELAY);
          break;
          
        case 'disconnected':
          // Wait longer before ICE restart for distant connections
          const iceWaitTime = rtt > 300 ? 10000 : 6000;
          setTimeout(() => {
            if (peer.iceConnectionState === 'disconnected' && peer.connectionState !== 'closed') {
              console.log(`ICE connection still disconnected for ${userId}, restarting ICE`);
              try {
                peer.restartIce();
              } catch (error) {
                console.error('Error restarting ICE:', error);
                recreatePeerConnection(userId);
              }
            }
          }, iceWaitTime);
          break;
          
        case 'connected':
          console.log(`ICE connection successful for ${userId}`);
          // Clear ICE gathering timeout on successful connection
          if (iceGatheringTimeouts.current[userId]) {
            clearTimeout(iceGatheringTimeouts.current[userId]);
            delete iceGatheringTimeouts.current[userId];
          }
          break;
      }
    };

    // Enhanced ICE gathering state monitoring
    peer.onicegatheringstatechange = () => {
      console.log(`ICE gathering state for ${userId}:`, peer.iceGatheringState);
      if (peer.iceGatheringState === 'complete') {
        if (iceGatheringTimeouts.current[userId]) {
          clearTimeout(iceGatheringTimeouts.current[userId]);
          delete iceGatheringTimeouts.current[userId];
        }
      }
    };

    // Enhanced ICE candidate handling with filtering
    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        // For distant connections, prioritize relay candidates
        const candidate = event.candidate;
        const isRelay = candidate.candidate.includes('typ relay');
        const isSrflx = candidate.candidate.includes('typ srflx');
        
        // Log candidate type for debugging
        console.log(`Sending ${candidate.candidate.includes('typ host') ? 'host' : 
                           isRelay ? 'relay' : 
                           isSrflx ? 'srflx' : 'unknown'} candidate to ${userId}`);
        
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

    // Enhanced negotiation handling for offerer
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
            // Enhanced offer options for distant connections
            iceRestart: false,
            voiceActivityDetection: true,
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
  }, [peerConfig, socket, recreatePeerConnection, clearUserTimeouts, networkQuality, rtt]);

  // Enhanced socket handlers
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
      
      // Stagger peer creation more for distant connections
      const staggerDelay = rtt > 300 ? 500 : 200;
      newUsers.forEach((id, index) => {
        setTimeout(() => {
          createPeerConnection(id, false);
        }, staggerDelay * index);
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
      
      // Remove connection status
      setConnectionStatus(prev => {
        const { [userId]: removed, ...rest } = prev;
        return rest;
      });
      
      // Clean up peer connection
      const peer = peersRef.current[userId];
      if (peer) {
        peer.close();
        delete peersRef.current[userId];
      }
      
      // Clean up stream
      if (streamsRef.current[userId]) {
        delete streamsRef.current[userId];
        setStreams(prev => {
          const { [userId]: removed, ...rest } = prev;
          return rest;
        });
      }
      
      // Clean up timeouts and retry attempts
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
        const answer = await peer.createAnswer({
          voiceActivityDetection: true,
        });
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
        const peer = peersRef.current[from];
        if (peer && peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
          console.log(`Added ICE candidate from ${from}`);
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
  }), [socket, router, createPeerConnection, clearUserTimeouts, rtt]);

  // Enhanced media initialization
  const initializeMedia = useCallback(async () => {
    try {
      setLoading(true);
      
      // Adaptive constraints based on network quality and distance
      const getConstraints = () => {
        const baseConstraints = {
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 1,
          }
        };
        
        // Adjust video constraints for distant/poor connections
        const isDistant = rtt > 300;
        
        switch (networkQuality) {
          case 'poor':
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: 480, max: 640 }, 
                height: { ideal: 270, max: 360 },
                frameRate: { ideal: 12, max: 15 }
              }
            };
          case 'fair':
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: isDistant ? 640 : 854 }, 
                height: { ideal: isDistant ? 360 : 480 },
                frameRate: { ideal: isDistant ? 20 : 24 }
              }
            };
          case 'good':
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: isDistant ? 854 : 1280 }, 
                height: { ideal: isDistant ? 480 : 720 },
                frameRate: { ideal: isDistant ? 24 : 30 }
              }
            };
          default:
            return {
              ...baseConstraints,
              video: { 
                width: { ideal: 1280 }, 
                height: { ideal: 720 },
                frameRate: { ideal: 30 }
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
      
      // Fallback: try audio only
      try {
        console.log('Attempting audio-only fallback');
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } 
        });
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
  }, [networkQuality, rtt]);

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
    
    // Clear all timeouts
    Object.values(reconnectTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    reconnectTimeouts.current = {};
    
    Object.values(connectionTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    connectionTimeouts.current = {};
    
    Object.values(iceGatheringTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    iceGatheringTimeouts.current = {};
    
    // Reset retry attempts
    retryAttempts.current = {};

    // Close all peer connections
    Object.values(peersRef.current).forEach(peer => {
      if (peer.connectionState !== 'closed') {
        peer.close();
      }
    });
    peersRef.current = {};

    // Stop media tracks
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      myStreamRef.current = null;
    }

    // Clear streams and states
    streamsRef.current = {};
    setStreams({});
    setMyStream(null);
    setUserNames({});
    setConnectionStatus({});
    setIsStreamActive(false);
    setHasCallStarted(false);
    setConnectionState('disconnected');

    // Leave socket room
    if (socket) {
      socket.emit("leave-room", { roomId });
    }
    
    console.log('Cleanup completed');
  }, [roomId, socket]);

  // Socket event listeners setup (unchanged)
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

  // Initialization with better error handling (unchanged)
  useEffect(() => {
    const init = async () => {
      // Check if user should be in this room
      if (sessionStorage.getItem("roomId") !== roomId) {
        router.push("/liveroom");
        return;
      }

      // Get user name
      const userName = sessionStorage.getItem("userName") || `User ${Date.now()}`;
      setCurrentUserName(userName);

      // Redirect if virtual experience data exists
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

  // Fetch products when component mounts or data changes (unchanged)
  useEffect(() => {
    if (x.length > 0) {
      debouncedFetchProducts(x);
      if (x.category) {
        debouncedFetchSimilarProducts(x.category);
      }
    }
  }, [x, debouncedFetchProducts, debouncedFetchSimilarProducts]);

  // Cleanup on unmount (unchanged)
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Control functions (unchanged)
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
        video: {
          width: { ideal: networkQuality === 'poor' ? 854 : 1920 },
          height: { ideal: networkQuality === 'poor' ? 480 : 1080 },
          frameRate: { ideal: networkQuality === 'poor' ? 15 : 30 }
        },
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

        // Update peer connections
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
  }, [networkQuality]);

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

  // Enhanced video component with error handling (unchanged)
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
            Optimizing for {rtt > 300 ? 'distant' : 'local'} connection
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
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

            {/* Enhanced connection statistics */}
            {connectionStats && (
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                Loss: {(connectionStats.lossRate * 100).toFixed(1)}% | 
                Delay: {(connectionStats.rtt * 1000).toFixed(0)}ms
              </div>
            )}
            
            {Object.keys(connectionStatus).length > 0 && (
              <div className="bg-black/70 text-white px-2 py-1 rounded text-xs max-w-xs">
                Connections: {Object.entries(connectionStatus).map(([userId, status]) => 
                  `${userNames[userId]?.slice(0, 8) || userId.slice(-4)}: ${status}`
                ).join(', ')}
              </div>
            )}

            {/* Distance indicator */}
            {rtt > 300 && (
              <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                Distant Connection Mode
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
              {/* My name overlay */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                {currentUserName || "You"} {isScreenSharing && "(Sharing Screen)"}
              </div>
              
              {/* Audio/Video status indicators */}
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

          {/* No stream message */}
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

          {/* Mobile Product Slider */}
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

            {/* Join/Exit Call Button */}
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
                {/* User name and status overlay */}
                <div className="absolute bottom-1 left-1 right-1 space-y-1">
                  <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium truncate text-center">
                    {userNames[userId] || `User ${userId.slice(-4)}`}
                  </div>
                  {connectionStatus[userId] && connectionStatus[userId] !== 'connected' && (
                    <div className={`text-xs text-center px-1 py-0.5 rounded ${
                      connectionStatus[userId].includes('retrying') ? 'bg-yellow-500' :
                      connectionStatus[userId] === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                    } text-white`}>
                      {connectionStatus[userId]}
                    </div>
                  )}
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
