import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Play,
  Square,
  Sparkles,
  RefreshCw,
  Send,
  Volume2,
  AlertCircle,
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { LiveAudioPlayer, floatTo16BitPCM, arrayBufferToBase64 } from '../utils/audioUtils';
import { HENDRIK_CV, OPENING_LINES } from '../data/hendrikCv';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioUrl?: string;
  source?: 'live' | 'chat';
  language?: 'en' | 'et';
}

interface VoiceAssistantHeroProps {
  onSendMessage: (text: string) => Promise<string | undefined>;
  messages: MessageItem[];
  isThinking: boolean;
  onPlayTTS: (text: string) => void;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
  language: 'en' | 'et';
  onLanguageChange: (lang: 'en' | 'et') => void;
  isDark: boolean;
}

export const VoiceAssistantHero: React.FC<VoiceAssistantHeroProps> = ({
  onSendMessage,
  messages,
  isThinking,
  onPlayTTS,
  isAudioPlaying,
  onStopAudio,
  language,
  onLanguageChange,
  isDark,
}) => {
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [liveStatus, setLiveStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('Puck');
  const [textInput, setTextInput] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const liveTranscriptBufferRef = useRef<string>('');
  const recognitionRef = useRef<any>(null);

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

  const speakingState = isAssistantSpeaking || isAudioPlaying;
  const currentOpeningLine = OPENING_LINES[language];

  // Live WebSocket session connection
  const startLiveSession = async () => {
    setLiveError(null);
    setLiveStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live?voice=${selectedVoice}&language=${language}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setLiveStatus('connected');
        setIsLiveActive(true);
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
            if (liveTranscriptBufferRef.current.trim()) {
              liveTranscriptBufferRef.current = '';
            }
          } else if (data.type === 'error') {
            console.error('Gemini Live WS error:', data.error);
            setLiveError(
              language === 'et'
                ? 'Reaalaja hääleühendus suunatakse tavarežiimi.'
                : 'Real-time live voice session falling back to standard voice mode.'
            );
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setLiveStatus('error');
        setLiveError(
          language === 'et'
            ? 'Ühendust ei õnnestunud luua. Kasutada saab kõneks teisendamist.'
            : 'Could not connect real-time socket. Standard tap-to-talk voice is ready.'
        );
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

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        language === 'et'
          ? 'Hääletuvastus ei ole selles veebilehitsejas toetatud. Palun sisestage küsimus tekstina.'
          : 'Speech recognition is not supported in this browser. Please type your query.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'et' ? 'et-EE' : 'en-US';
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
        console.warn('Speech recognition notice:', event.error);
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
      wsRef.current.send(JSON.stringify({ type: 'text', text: query }));
    } else {
      onSendMessage(query);
    }
    setTextInput('');
  };

  const handleOpeningLinePlay = () => {
    onPlayTTS(currentOpeningLine);
  };

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-900/5 dark:shadow-black/20 p-6 sm:p-10 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Ambient Halo & Avatar */}
        <div className="relative mb-6">
          {speakingState && (
            <div className="absolute -inset-3 rounded-full bg-sky-500/20 dark:bg-sky-400/20 blur-md animate-pulse pointer-events-none" />
          )}

          {isLiveActive && !speakingState && (
            <div className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse pointer-events-none" />
          )}

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden p-0.5 bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center relative">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                HP
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 mt-0.5">
                Tallinn, EE
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Title & Metadata (Unboxed, Anti-Pill) */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hendrik Puhkan Voice Assistant
        </h1>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 font-normal">
          <span>First-person voice ("I")</span>
          <span aria-hidden="true">·</span>
          <span>EBS Entrepreneurship</span>
          <span aria-hidden="true">·</span>
          <span>Gemini 3.8 Live</span>
        </div>

        {/* Audio Waveform Stage */}
        <div className="w-full my-6 py-3 px-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center">
          <AudioVisualizer
            analyser={audioPlayerRef.current?.getAnalyser() || null}
            isActive={speakingState || isLiveActive || isTranscribing}
            mode={speakingState ? 'speaking' : isLiveActive || isTranscribing ? 'listening' : 'idle'}
            isDark={isDark}
          />
          <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                speakingState
                  ? 'bg-sky-500 animate-ping'
                  : isLiveActive
                  ? 'bg-emerald-500 animate-pulse'
                  : isThinking
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-400 dark:bg-slate-600'
              }`}
            />
            <span>
              {speakingState
                ? language === 'et'
                  ? 'Hendrik räägib...'
                  : 'Hendrik is speaking...'
                : isThinking
                ? language === 'et'
                  ? 'Mõtlen...'
                  : 'Thinking...'
                : isLiveActive
                ? isMicMuted
                  ? language === 'et'
                    ? 'Mikrofon on vaigistatud'
                    : 'Microphone Muted'
                  : language === 'et'
                  ? 'Reaalaja ühendus aktiivne — rääkige vabalt'
                  : 'Live Microphone Active — Speak naturally'
                : isTranscribing
                ? language === 'et'
                  ? 'Kuulan mikrofoni...'
                  : 'Listening to your microphone...'
                : language === 'et'
                ? 'Valmis küsimusteks'
                : 'Ready for conversation'}
            </span>

            {speakingState && (
              <button
                onClick={() => {
                  audioPlayerRef.current?.stop();
                  onStopAudio();
                }}
                className="ml-2 px-2 py-0.5 rounded text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <Square className="w-2.5 h-2.5" />
                <span>{language === 'et' ? 'Peata' : 'Stop'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Editorial Opening Greeting Box */}
        <div className="w-full text-left my-2 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 tracking-wide uppercase">
              {language === 'et' ? 'Ametlik ava-lause' : 'Official Opening Line'}
            </div>
            <p className="text-sm font-normal text-slate-800 dark:text-slate-200 mt-1 italic leading-relaxed">
              "{currentOpeningLine}"
            </p>
          </div>

          <button
            onClick={handleOpeningLinePlay}
            disabled={speakingState}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-transparent dark:border-slate-700/80 shadow-xs transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'et' ? 'Kuula avakõnet' : 'Play Greeting'}</span>
          </button>
        </div>

        {/* Error notification if any */}
        {liveError && (
          <div className="w-full my-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>{liveError}</span>
          </div>
        )}

        {/* Main Voice Actions */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2.5 mt-5">
          {/* Live Voice Button (Gemini 3.8 Live API) */}
          <button
            onClick={isLiveActive ? stopLiveSession : startLiveSession}
            disabled={liveStatus === 'connecting'}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-all shadow-xs ${
              isLiveActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white hover:scale-[1.01]'
            }`}
          >
            {isLiveActive ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>{language === 'et' ? 'Lõpeta kõne' : 'Disconnect Live Voice'}</span>
              </>
            ) : liveStatus === 'connecting' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'et' ? 'Ühendan...' : 'Connecting Live API...'}</span>
              </>
            ) : (
              <>
                <Radio className="w-3.5 h-3.5 text-sky-400 dark:text-sky-200" />
                <span>
                  {language === 'et' ? 'Alusta reaalaja kõnet (Gemini Live)' : 'Start Live Voice Conversation'}
                </span>
              </>
            )}
          </button>

          {/* Tap-to-Talk Mic Button */}
          {!isLiveActive && (
            <button
              onClick={startSpeechRecognition}
              disabled={isTranscribing || isThinking}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs border transition-colors ${
                isTranscribing
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {isTranscribing
                  ? language === 'et'
                    ? 'Kuulan...'
                    : 'Listening...'
                  : language === 'et'
                  ? 'Vajuta ja räägi'
                  : 'Tap to Speak'}
              </span>
            </button>
          )}

          {/* Live Mic Mute Toggle */}
          {isLiveActive && (
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                isMicMuted
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{isMicMuted ? (language === 'et' ? 'Vaigistatud' : 'Muted') : language === 'et' ? 'Vaigista' : 'Mute Mic'}</span>
            </button>
          )}

          {/* Language Toggle in Console */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('et')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                language === 'et'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Eesti keel
            </button>
          </div>
        </div>

        {/* Minimalist Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserSubmit();
          }}
          className="w-full mt-5 flex items-center gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              language === 'et'
                ? 'Küsige kogemuste, Alter Marine turunduse või EBS-i kohta...'
                : 'Ask Hendrik about experience, skills, Alter Marine, EBS...'
            }
            disabled={isThinking}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-sky-400 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isThinking}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-transparent dark:border-slate-700"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'et' ? 'Küsi' : 'Ask'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
