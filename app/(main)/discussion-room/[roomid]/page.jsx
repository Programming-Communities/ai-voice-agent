"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

function DiscussionRoom() {
  const params = useParams();
  const roomid = params?.roomid;

  const DiscussionRoomData = useQuery(
    api.DiscussionRoom.GetDiscussionRoom,
    roomid ? { id: roomid } : null // ✅ Ensure it's null if undefined
  );

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [RecordRTC, setRecordRTC] = useState(null);
  const recorder = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const realtimeTranscriber = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("recordrtc")
        .then((module) => {
          setRecordRTC(module.default || module);
        })
        .catch((error) => console.error("Failed to load RecordRTC:", error));
    }
  }, []);

  useEffect(() => {
    if (DiscussionRoomData?.expertName) {
      const Expert = CoachingExpert.find(
        (item) => item.name === DiscussionRoomData.expertName
      );
      setExpert(Expert || null);
    }
  }, [DiscussionRoomData]);

  const connectToServer = () => {
    if (!RecordRTC) {
      console.error("RecordRTC is not loaded yet.");
      return;
    }

    setEnableMic(true);
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorder.current = new RecordRTC(stream, {
            type: "audio",
            mimeType: "audio/webm;codecs=pcm",
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
              if (!realtimeTranscriber.current) return;
              clearTimeout(silenceTimeoutRef.current);
              silenceTimeoutRef.current = setTimeout(() => {
                console.log("User stopped talking");
              }, 2000);
            },
          });
          recorder.current.startRecording();
        })
        .catch((err) => console.error("Microphone access error:", err));
    }
  };

  const disconnect = (e) => {
    e.preventDefault();
    if (recorder.current) {
      recorder.current.stopRecording(() => {
        recorder.current = null;
        setEnableMic(false);
      });
    }
  };

  return (
    <div className="mt-1">
      <h2 className="text-lg font-bold">{DiscussionRoomData?.coachingOption}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div
            className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative"
          >
            {expert?.avatar && (
              <Image
                src={expert.avatar}
                alt="avatar"
                width={200}
                height={200}
                className="w-[80px] h-[80px] rounded-full object-cover animate-pulse"
              />
            )}

            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer}>Connect</Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <div>
          <div
            className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative"
          >
            <h2>Chat Section</h2>
          </div>
          <h2 className="mt-4 text-gray-400">
            At the end of your conversation, we will automatically generate a feedback/notes form from your conversation.
          </h2>
        </div>
      </div>
    </div>
  );
}

export default DiscussionRoom;





// "use client";
// import { Button } from "@/components/ui/button";
// import { api } from "@/convex/_generated/api";
// import { CoachingExpert } from "@/services/Options";
// import { UserButton } from "@stackframe/stack";
// import { useQuery } from "convex/react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState ,useRef } from "react";
// const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
// // import RecordRTC from "recordrtc";

// function DiscussionRoom() {
//   const { roomid } = useParams();

//   // ✅ Ensure query runs even if roomid is undefined
//   const DiscussionRoomData = useQuery(
//     api.DiscussionRoom.GetDiscussionRoom,
//     roomid ? { id: roomid } : undefined
//   );

//   const [expert, setExpert] = useState(null);
//   const [enableMic,setEnableMic]=useState(false);
//   const  recorder=useRef(null);
//   let silenceTimeout;
//   useEffect(() => {
//     // ✅ Ensure DiscussionRoomData is fully loaded before accessing properties
//     if (DiscussionRoomData && DiscussionRoomData.expertName) {
//       const Expert = CoachingExpert.find(
//         (item) => item.name === DiscussionRoomData.expertName
//       );
//       console.log(Expert);
//       setExpert(Expert);
//     }
//   }, [DiscussionRoomData]);

//   const connectToServer = () => {
//     setEnableMic(true);
//     if (typeof window !== "undefined" && typeof navigator !== "undefined") {
//       navigator.mediaDevices
//         .getUserMedia({ audio: true })
//         .then((stream) => {
//           recorder.current = new RecordRTC(stream, {
//             type: "audio",
//             mimeType: "audio/webm;codecs=pcm",
//             recorderType: RecordRTC.StereoAudioRecorder,
//             timeSlice: 250,
//             desiredSampRate: 16000,
//             numberOfAudioChannels: 1,
//             bufferSize: 4096,
//             audioBitsPerSecond: 128000,
//             ondataavailable: async (blob) => {
//               if (!realtimeTranscriber.current) return;

//               // Reset the silence detection timer on audio input
//               clearTimeout(silenceTimeout);

//               const buffer = await blob.arrayBuffer();

//               //console.log(buffer)

//               // Restart the silence detection timer
//               silenceTimeout = setTimeout(() => {
//                 console.log("User stopped talking");
//                 // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
//               }, 2000);
//             },
//           });

//           recorder.current.startRecording();
//         })
//         .catch((err) => console.error(err));
//     }
//   };

//   const disconnect =(e)=>{
//     e.preventDefault();
//     recorder.current.pauseRecording();
//     recorder.current=null;
//     setEnableMic(false);
//   }

//   return (
//     <div className="mt-1">
//       <h2 className="text-lg font-bold">
//         {DiscussionRoomData?.coachingOption}
//       </h2>
//       <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2">
//           <div
//             className=" h-[60vh] bg-secondary border rounded-4xl
//         flex flex-col items-center justify-center relative"
//           >
//             {/* ✅ Prevents error if `expert` is null */}
//             {expert?.avatar && (
//               <Image
//                 src={expert.avatar}
//                 alt="avatar"
//                 width={200}
//                 height={200}
//                 className="w-[80px] h-[80px] rounded-full object-cover animate-pulse"
//               />
//             )}

//             <h2 className="text-gray-500">{expert?.name}</h2>
//             <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10 ">
//               <UserButton />
//             </div>
//           </div>
//           <div className="mt-5 flex items-center justify-center">
//            {!enableMic? <Button onClick={connectToServer}>Connect</Button>
//            :
//            <Button variant='destructive' onClick={disconnect}>Disconnect</Button>

// }
//           </div>
//         </div>
//         <div>
//           <div
//             className=" h-[60vh] bg-secondary border rounded-4xl
//                         flex flex-col items-center justify-center relative
//                        "
//           >
//             <h2>Chat Section</h2>
//           </div>
//           <h2 className="mt-4 text-gray-400">
//             At the end of your conversation we weill automatically generate a
//             feedback/notes form your conversation
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DiscussionRoom;
