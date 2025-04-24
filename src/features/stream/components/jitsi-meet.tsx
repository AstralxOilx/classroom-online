import { useEffect, useRef } from "react";

interface JitsiMeetProps {
  displayName: string;
}

export default function JitsiMeet({ displayName }: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.getElementById("jitsi-api")) return resolve(); // ตรวจสอบว่ามี script แล้ว
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.id = "jitsi-api";
        script.async = true;
        script.onload = () => {
          console.log("Jitsi API script loaded successfully");
          resolve();
        };
        script.onerror = (err) => {
          console.error("Error loading Jitsi API script:", err);
          reject(err);
        };
        document.body.appendChild(script);
      });
    };

    loadScript().then(() => {
      if (containerRef.current) {
        // ล้าง container เดิมก่อน mount ใหม่
        containerRef.current.innerHTML = "";

        const domain = "meet.jit.si";
        const options = {
          roomName: "online-class-anuwat",
          width: "100%",
          height: 600,
          parentNode: containerRef.current,
          userInfo: {
            displayName,
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
          },
        };

        // ตรวจสอบว่า `window.JitsiMeetExternalAPI` โหลดมาเรียบร้อยแล้ว
        if (window.JitsiMeetExternalAPI) {
          console.log("JitsiMeetExternalAPI is available");
          apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
        } else {
          console.error("JitsiMeetExternalAPI is not available");
        }
      }
    }).catch((err) => {
      console.error("Failed to load Jitsi API script", err);
    });

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [displayName]);

  return <div ref={containerRef} style={{ width: "100%", borderRadius: 8 }} />;
}
