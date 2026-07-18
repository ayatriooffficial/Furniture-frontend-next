"use client";

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<{lat: number, lng: number}>} User's coordinates
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS/connection.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // Require exact location
        timeout: 20000, // Increased timeout for accurate location
        maximumAge: 0 // Force fresh location, no cache
      }
    );
  });
};

/**
 * Get user location from localStorage if available
 * @returns {<{lat: number, lng: number} | null>} User's coordinates or null
 */
export const getUserLocationFromStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userCoordinates = localStorage.getItem('userCoordinates');
    if (userCoordinates) {
      try {
        return JSON.parse(userCoordinates);
      } catch (e) {
        console.error('Error parsing user coordinates from storage:', e);
        return null;
      }
    }
  }
  return null;
};
