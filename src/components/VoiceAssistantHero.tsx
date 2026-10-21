import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Play,
  Square,
  Sparkles,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { LiveAudioPlayer, floatTo16BitPCM, arrayBufferToBase64 } from '../utils/audioUtils';
import { HENDRIK_CV } from '../data/hendrikCv';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioUrl?: string;
  source?: 'live' | 'chat';
}

interface VoiceAssistantHeroProps {
  onSendMessage: (text: string) => Promise<string | undefined>;
  messages: MessageItem[];
  isThinking: boolean;
  onPlayTTS: (text: string) => void;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
}

const OPENING_LINE =
  "Hi, I'm an AI assistant representing Hendrik Puhkan. I can tell you about my background, skills, and projects. What would you like to know?";

export const VoiceAssistantHero: React.FC<VoiceAssistantHeroProps> = ({
  onSendMessage,
  messages,
  isThinking,
  onPlayTTS,
  isAudioPlaying,
  onStopAudio,
}) => {
  // Live WebSocket state
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [liveStatus, setLiveStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck');
  const [textInput, setTextInput] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  // References for Live audio stream
  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const liveTranscriptBufferRef = useRef<string>('');

  // Speech recognition fallback for tap-to-talk in browsers
  const recognitionRef = useRef<any>(null);

  // Initialize LiveAudioPlayer
  useEffect(() => {
    const player = new LiveAudioPlayer((isPlaying) => {
      setIsAssistantSpeaking(isPlaying);
    });
    audioPlayerRef.current = player;

    return () => {
      player.close();
      stopLiveSession();
    };
  }, []);

  // Sync assistant speaking state with external TTS playback
  const speakingState = isAssistantSpeaking || isAudioPlaying;

  // Toggle Live Voice Mode (Gemini 3.8 Live API)
  const startLiveSession = async () => {
    setLiveError(null);
    setLiveStatus('connecting');

    try {
      // 1. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      // 2. Connect WebSocket to server
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live?voice=${selectedVoice}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setLiveStatus('connected');
        setIsLiveActive(true);
        // Start streaming mic audio
        setupAudioRecording(stream, ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'audio' && data.audio) {
            audioPlayerRef.current?.playChunk(data.audio);
          } else if (data.type === 'transcript' && data.text) {
            liveTranscriptBufferRef.current += data.text;
          } else if (data.type === 'interrupted') {
            audioPlayerRef.current?.stop();
          } else if (data.type === 'turnComplete') {
            // Commit any accumulated live transcript to conversation history
            if (liveTranscriptBufferRef.current.trim()) {
              liveTranscriptBufferRef.current = '';
            }
          } else if (data.type === 'error') {
            console.error('Gemini Live WS error:', data.error);
            setLiveError('Live voice session encountered a notice. Falling back to standard voice mode.');
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setLiveStatus('error');
        setLiveError('Could not establish real-time socket. You can still use tap-to-talk voice!');
        stopLiveSession();
      };

      ws.onclose = () => {
        setLiveStatus('disconnected');
        setIsLiveActive(false);
      };
    } catch (err: any) {
      console.error('Mic or WebSocket setup failed:', err);
      setLiveStatus('error');
      setLiveError(err.message || 'Microphone access denied or WebSocket failure.');
      stopLiveSession();
    }
  };

  const setupAudioRecording = (stream: MediaStream, ws: WebSocket) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      // 4096 frames at 16kHz = ~256ms chunk
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (isMicMuted || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16Buffer = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcm16Buffer);

        ws.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          })
        );
      };
    } catch (e) {
      console.error('Failed to initialize audio recording node:', e);
    }
  };

  const stopLiveSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    audioPlayerRef.current?.stop();
    setIsLiveActive(false);
    setLiveStatus('disconnected');
  };

  // Push-to-talk / speech recognition for quick questions
  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsTranscribing(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserSubmit(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };

      recognition.onend = () => {
        setIsTranscribing(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsTranscribing(false);
    }
  };

  const handleUserSubmit = (queryText?: string) => {
    const query = queryText || textInput.trim();
    if (!query) return;

    if (isLiveActive && wsRef.current?.readyState === WebSocket.OPEN) {
      // Send as text through live stream
      wsRef.current.send(JSON.stringify({ type: 'text', text: query }));
    } else {
      onSendMessage(query);
    }
    setTextInput('');
  };

  const handleOpeningLinePlay = () => {
    onPlayTTS(OPENING_LINE);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Avatar & Voice Core */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Avatar Ring */}
        <div className="relative mb-6">
          {/* Animated voice pulse rings */}
          {speakingState && (
            <>
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-md animate-ping pointer-events-none" />
              <div className="absolute -inset-2 rounded-full border-2 border-indigo-400/60 animate-pulse pointer-events-none" />
            </>
          )}

          {isLiveActive && !speakingState && (
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/50 animate-pulse pointer-events-none" />
          )}

          {/* Profile photo container */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center relative group">
              <img
                src="/assets/aistudio/Hendrik_PuhkanCV_e7d766aa.pdf"
                alt="Hendrik Puhkan"
                onError={(e) => {
                  // Fallback to high-res stylized persona representation
                  e.currentTarget.style.display = 'none';
                }}
                className="w-full h-full object-cover"
              />
              {/* Fallback stylized avatar if PDF image isn't directly rasterizable as an img tag */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white">
                <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-transparent">
                  HP
                </span>
                <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider mt-0.5">
                  Hendrik
                </span>
              </div>
            </div>

            {/* Live active badge */}
            <div className="absolute bottom-1 right-1 flex items-center justify-center">
              <span
                className={`flex h-6 w-6 rounded-full items-center justify-center shadow-lg border-2 border-slate-950 ${
                  isLiveActive ? 'bg-emerald-500 text-white' : speakingState ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}
                title={isLiveActive ? 'Live Audio Connected' : 'Voice Standby'}
              >
                <Radio className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Identity & Status */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Hendrik Puhkan Voice Assistant
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-lg">
          Speaks as Hendrik in the first person ("I") for recruiters, employers, and clients. Powered by Google Gemini.
        </p>

        {/* Audio Waveform Visualizer */}
        <div className="w-full my-4 py-2 px-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center">
          <AudioVisualizer
            analyser={audioPlayerRef.current?.getAnalyser() || null}
            isActive={speakingState || isLiveActive || isTranscribing}
            mode={speakingState ? 'speaking' : isLiveActive || isTranscribing ? 'listening' : 'idle'}
          />
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                speakingState
                  ? 'bg-purple-400 animate-ping'
                  : isLiveActive
                  ? 'bg-emerald-400 animate-pulse'
                  : isThinking
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-400 font-medium">
              {speakingState
                ? 'Hendrik is speaking...'
                : isThinking
                ? 'Thinking...'
                : isLiveActive
                ? isMicMuted
                  ? 'Live Connected (Mic Muted)'
                  : 'Live Microphone Active — Listening to you...'
                : isTranscribing
                ? 'Listening to your microphone...'
                : 'Ready for questions'}
            </span>
            {speakingState && (
              <button
                onClick={() => {
                  audioPlayerRef.current?.stop();
                  onStopAudio();
                }}
                className="ml-2 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center gap-1"
              >
                <Square className="w-2.5 h-2.5" /> Stop
              </button>
            )}
          </div>
        </div>

        {/* Required Opening Greeting Card */}
        <div className="w-full text-left my-3 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Assistant Opening Line
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-200">
                  First-person voice
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-1 italic">
                "{OPENING_LINE}"
              </p>
            </div>
          </div>

          <button
            onClick={handleOpeningLinePlay}
            disabled={speakingState}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Greeting</span>
          </button>
        </div>

        {/* Error notification if any */}
        {liveError && (
          <div className="w-full my-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{liveError}</span>
          </div>
        )}

        {/* Voice Interaction Controls */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3 mt-4">
          {/* Real-time Live Mode Toggle (Gemini 3.8 Live API) */}
          <button
            onClick={isLiveActive ? stopLiveSession : startLiveSession}
            disabled={liveStatus === 'connecting'}
            className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm transition-all shadow-lg ${
              isLiveActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 hover:scale-[1.02]'
            }`}
          >
            {isLiveActive ? (
              <>
                <Square className="w-4 h-4" />
                <span>Disconnect Live Voice</span>
              </>
            ) : liveStatus === 'connecting' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting Live API...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Start Live Voice Conversation</span>
              </>
            )}
          </button>

          {/* Tap-to-Talk Mic Button */}
          {!isLiveActive && (
            <button
              onClick={startSpeechRecognition}
              disabled={isTranscribing || isThinking}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm border transition-all ${
                isTranscribing
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>{isTranscribing ? 'Listening...' : 'Tap to Speak'}</span>
            </button>
          )}

          {/* Live Mic Mute toggle */}
          {isLiveActive && (
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-medium border transition-colors ${
                isMicMuted
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMicMuted ? 'Mic Muted' : 'Mute Mic'}</span>
            </button>
          )}

          {/* Voice model selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Voice:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-medium"
            >
              <option value="Puck" className="bg-slate-900 text-white">
                Puck (Young & Energetic)
              </option>
              <option value="Zephyr" className="bg-slate-900 text-white">
                Zephyr (Smooth & Calm)
              </option>
              <option value="Fenrir" className="bg-slate-900 text-white">
                Fenrir (Deep & Confident)
              </option>
            </select>
          </div>
        </div>

        {/* Text fallback input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit();
          }}
          className="w-full mt-5 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask Hendrik about experience, skills, Alter Marine, EBS..."
              disabled={isThinking}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!textInput.trim() || isThinking}
            className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
