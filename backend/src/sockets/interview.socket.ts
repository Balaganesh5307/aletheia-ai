import { Server, Socket } from 'socket.io';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

export const configureSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    // Join interview session room
    socket.on('join-interview', (interviewId: string) => {
      socket.join(interviewId);
      console.log(`Socket ${socket.id} joined interview: ${interviewId}`);
    });

    // Process real-time video frames (webcam stream)
    socket.on('video-frame', async (data: { interviewId: string; frame: string }) => {
      try {
        // Forward frame (base64) to FastAPI CV service
        let analytics = {
          eyeContact: true,
          goodPosture: true,
          dominantEmotion: 'Neutral',
          feedbackMessage: 'Keep it up!'
        };

        try {
          const response = await axios.post(`${AI_SERVICE_URL}/api/analyze-frame`, {
            frame: data.frame
          }, { timeout: 2000 });
          
          analytics = response.data;
        } catch (err) {
          // Dynamic simulation for dev fallback:
          // Eye contact can occasionally drift, posture can slump if they move, emotions random.
          const rand = Math.random();
          const eyeContact = rand > 0.15;
          const goodPosture = rand > 0.12;
          
          let dominantEmotion = 'Neutral';
          if (rand < 0.08) dominantEmotion = 'Happy';
          else if (rand < 0.12) dominantEmotion = 'Surprised';
          else if (rand < 0.15) dominantEmotion = 'Fearful';

          let feedbackMessage = 'Looking good!';
          if (!eyeContact) {
            feedbackMessage = 'Maintain eye contact with the camera.';
          } else if (!goodPosture) {
            feedbackMessage = 'Sit straight and maintain a professional posture.';
          } else if (dominantEmotion === 'Fearful' || dominantEmotion === 'Sad') {
            feedbackMessage = 'Take a deep breath. Try to smile and speak confidently.';
          }

          analytics = {
            eyeContact,
            goodPosture,
            dominantEmotion,
            feedbackMessage
          };
        }

        // Send back analysis results immediately
        socket.emit('frame-feedback', analytics);
      } catch (error: any) {
        console.error('Error processing video frame socket:', error.message);
      }
    });

    // Clean up
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
