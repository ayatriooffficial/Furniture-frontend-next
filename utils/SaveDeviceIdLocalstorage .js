"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const SaveDeviceIdLocalstorage = () => {
  function handleLocalStorageSave() {
    if (typeof window !== "undefined" && window.localStorage) {
      const existingDeviceId = localStorage.getItem("deviceId");
      if (!existingDeviceId) {
        // const navigatorInfo = `${navigator.userAgent}${navigator.language}${navigator.platform}`;
        // const hash = btoa(navigatorInfo);
        const uniqueDeviceId = uuidv4();
        localStorage.setItem("deviceId", uniqueDeviceId);
      }
    }
  }
  useEffect(() => {
    handleLocalStorageSave();
  }, []);
  return null;
};

export default SaveDeviceIdLocalstorage;
