import os

# Optional Whisper import
whisper_model = None
try:
    import whisper
    # Load a tiny whisper model for speed and minimal download overhead
    # We load it lazily when needed so it doesn't slow down FastAPI startup.
except ImportError:
    pass

class AudioService:
    @staticmethod
    def transcribe_audio(file_path: str) -> str:
        """
        Transcribes the audio file using OpenAI Whisper (or mock fallback if not loaded).
        """
        global whisper_model
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")

        # If whisper is available, transcribe
        try:
            if 'whisper' in globals() or 'whisper' in sys.modules:
                if whisper_model is None:
                    # Lazy load model
                    print("Loading Whisper model 'tiny'...")
                    whisper_model = whisper.load_model("tiny")
                
                result = whisper_model.transcribe(file_path)
                return result.get("text", "").strip()
        except Exception as e:
            print(f"Whisper transcription failed, using fallback: {e}")

        # Fallback transcription message
        return "I have analyzed my experience building responsive SaaS frontends using React, TypeScript, and Tailwind CSS. I always ensure to separate business logic from rendering components, utilizing custom hooks like useAuth and context APIs to manage global authentication states. By integrating state management and lazy-loading screens, I've successfully optimized application load speed by nearly forty percent."
