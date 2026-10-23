'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Headphones,
  User,
  Bot
} from 'lucide-react';
import { sharedApiClient, ChatMessage } from '@shared/index';
import { getSavedFarmerLocation } from '@/lib/location';

export default function ChatPage() {
  const { t, locale } = useLanguage();

  const isEn = locale === 'en';
  const isMr = locale === 'mr';

  const strings = {
    brand: isEn ? 'KisanMitra' : isMr ? 'किसानमित्र' : 'किसानमित्र',
    promptBanner: isEn
      ? 'Speak or write in English'
      : isMr
      ? 'मराठीत बोला किंवा लिहा'
      : 'हिंदी में बोलें या लिखें',
    listen: isEn ? 'Listen' : isMr ? 'ऐका' : 'सुनें',
    stopAudio: isEn ? 'Stop' : isMr ? 'थांबवा' : 'रोकें',
    placeholder: isEn ? 'Type here...' : isMr ? 'येथे लिहा...' : 'यहाँ लिखें...',
    sourcesLabel: isEn ? 'Source:' : isMr ? 'स्रोत:' : 'स्रोत:',
    sourceText: isEn
      ? 'Agmarknet, KisanMitra Forecast'
      : isMr
      ? 'Agmarknet, KisanMitra अंदाज'
      : 'Agmarknet, KisanMitra अनुमान',
    userSampleQuery: isEn
      ? 'When should I sell my onion?'
      : isMr
      ? 'माझा कांदा कधी विकू?'
      : 'मेरा प्याज कब बेचूं?',
    botSampleAnswer: isEn
      ? 'Today the best market is Lasalgaon. Over the next 14 days, prices are expected to rise slightly, so holding stock is recommended. This is decision support, not a guarantee.'
      : isMr
      ? 'आज सर्वोत्तम बाजार लासलगाव आहे. १४ दिवसांत भाव थोडा वाढण्याची शक्यता आहे, म्हणून थांबणे चांगले. हा अंदाज आहे, हमी नाही.'
      : 'आज सर्वोत्तम मंडी लासलगांव है। 14 दिनों में भाव थोड़ा बढ़ने की संभावना है, इसलिए रुकना बेहतर रहेगा। यह निर्णय सहायता है, गारंटी नहीं।',
    chips: isEn
      ? ['Best Market', 'Fertilizer Schedule', 'Talk to an Expert']
      : isMr
      ? ['सर्वोत्तम बाजार', 'खताचे वेळापत्रक', 'तज्ज्ञाशी बोला']
      : ['सर्वोत्तम मंडी', 'खाद का कार्यक्रम', 'विशेषज्ञ से बात करें'],
    talkExpertTitle: isEn ? 'Need agronomic advice?' : isMr ? 'कृषी सल्ला हवा आहे?' : 'कृषि सलाह चाहिए?',
    talkExpertBtn: isEn ? 'Talk to Agronomist' : isMr ? 'कृषी तज्ञांशी बोला' : 'कृषि विशेषज्ञ से बात करें'
  };

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [playingVoiceNote, setPlayingVoiceNote] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize with exact conversation from PDF Page 2
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-user-1',
      sender: 'farmer',
      channel: 'web',
      language: locale,
      text: strings.userSampleQuery,
      timestamp: '0:07',
      audioUrl: 'mock-voice-note.mp3'
    },
    {
      id: 'msg-bot-1',
      sender: 'bot',
      channel: 'web',
      language: locale,
      text: strings.botSampleAnswer,
      sources: [strings.sourceText],
      suggestedButtons: strings.chips,
      timestamp: '10:02 AM'
    }
  ]);

  // Update initial messages when locale switches
  useEffect(() => {
    setMessages([
      {
        id: 'msg-user-1',
        sender: 'farmer',
        channel: 'web',
        language: locale,
        text: strings.userSampleQuery,
        timestamp: '0:07',
        audioUrl: 'mock-voice-note.mp3'
      },
      {
        id: 'msg-bot-1',
        sender: 'bot',
        channel: 'web',
        language: locale,
        text: strings.botSampleAnswer,
        sources: [strings.sourceText],
        suggestedButtons: strings.chips,
        timestamp: '10:02 AM'
      }
    ]);
  }, [locale]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'farmer',
      channel: 'web',
      language: locale,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          language: locale,
          channel: 'web',
          location: getSavedFarmerLocation(),
        }),
      });

      if (res.ok) {
        const botReply = await res.json();
        setMessages(prev => [...prev, botReply]);
      } else {
        const fallback = await sharedApiClient.sendChatMessage(query, locale, 'web');
        setMessages(prev => [...prev, fallback]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = await sharedApiClient.sendChatMessage(query, locale, 'web');
      setMessages(prev => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoiceNote = () => {
    setPlayingVoiceNote(!playingVoiceNote);
    if ('speechSynthesis' in window && !playingVoiceNote) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(strings.userSampleQuery);
      utterance.lang = locale === 'mr' ? 'mr-IN' : locale === 'en' ? 'en-IN' : 'hi-IN';
      utterance.onend = () => setPlayingVoiceNote(false);
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const handlePlayAudio = (msgId: string, text: string) => {
    if (isPlayingAudio === msgId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudio(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown asterisks & bullets for natural speech
      const cleanSpeech = text
        .replace(/\*\*/g, '')
        .replace(/•/g, '')
        .replace(/#/g, '')
        .trim();
      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      // Auto-detect speech language from text script
      if (/[\u0C80-\u0CFF]/.test(text)) utterance.lang = 'kn-IN';
      else if (/[\u0C00-\u0C7F]/.test(text)) utterance.lang = 'te-IN';
      else if (/[\u0B80-\u0BFF]/.test(text)) utterance.lang = 'ta-IN';
      else if (/[\u0A80-\u0AFF]/.test(text)) utterance.lang = 'gu-IN';
      else if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = locale === 'hi' ? 'hi-IN' : 'mr-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(msgId);
    } else {
      alert(text);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = locale === 'mr' ? 'mr-IN' : locale === 'en' ? 'en-IN' : 'hi-IN';
      recognition.interimResults = false;
      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        setInput(transcript);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        fallbackSpeech();
      };

      recognition.start();
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const query = strings.userSampleQuery;
      setInput(query);
      handleSendMessage(query);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] flex flex-col justify-between">
      
      {/* Top Banner (Exact Replica of PDF Page 2: Dark Green Header) */}
      <div className="bg-[#165b33] text-white px-4 sm:px-6 py-4 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {strings.brand}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              {strings.promptBanner}
            </p>
          </div>

          <Link
            href="/admin"
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            {strings.talkExpertBtn}
          </Link>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <main className="max-w-3xl w-full mx-auto flex-1 px-4 sm:px-6 py-6 flex flex-col justify-between space-y-6">
        
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Farmer Audio Bubble (Exact Replica of PDF Page 2) */}
              {msg.sender === 'farmer' ? (
                <div className="bg-[#e4ede6] rounded-2xl px-4 py-3 max-w-[85%] sm:max-w-[75%] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleVoiceNote}
                      className="w-7 h-7 rounded-full bg-[#165b33] text-white flex items-center justify-center shrink-0 shadow-xs"
                      title="Play Voice Note"
                    >
                      {playingVoiceNote ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>

                    {/* Waveform graphic */}
                    <div className="flex items-center gap-1 text-[#165b33]">
                      <span className="w-1 h-3 bg-[#165b33] rounded-full inline-block animate-pulse" />
                      <span className="w-1 h-5 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-4 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-6 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-4 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-5 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-3 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-4 bg-[#165b33] rounded-full inline-block" />
                      <span className="w-1 h-5 bg-[#165b33] rounded-full inline-block" />
                    </div>

                    <span className="text-xs text-gray-600 font-medium ml-1">
                      {msg.timestamp || '0:07'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-900 pt-0.5">
                    {msg.text}
                  </p>
                </div>
              ) : (
                /* Bot Response Card with rich whitespace and typography */
                <div className="bg-white border border-gray-200/90 rounded-2xl p-5 max-w-[95%] sm:max-w-[85%] shadow-xs space-y-3">
                  <div className="text-sm sm:text-base text-gray-900 leading-relaxed font-normal whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Sources citation */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="text-xs text-gray-500 font-medium">
                      <span>{strings.sourcesLabel} </span>
                      <span className="text-gray-700">{msg.sources.join(', ')}</span>
                    </div>
                  )}

                  {/* Listen Pill Button matching PDF Page 2: [ऐका] */}
                  <div>
                    <button
                      onClick={() => handlePlayAudio(msg.id, msg.text)}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        isPlayingAudio === msg.id
                          ? 'bg-[#165b33] text-white border-[#165b33]'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingAudio === msg.id ? strings.stopAudio : strings.listen}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Dynamic Contextual Suggestion Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(() => {
              const latestBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
              const currentChips = latestBotMsg?.suggestedButtons?.length ? latestBotMsg.suggestedButtons : strings.chips;
              return currentChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#165b33] text-xs sm:text-sm font-semibold text-gray-800 transition-all shadow-xs"
                >
                  {chip}
                </button>
              ));
            })()}
          </div>

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-500 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#165b33] animate-ping" />
                <span>{isEn ? 'Retrieving verified APMC and agronomic advisory...' : 'कृषी सल्लागार माहिती शोधत आहे...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Bar (Exact Replica of PDF Page 2: 'येथे लिहा...' + Round Green Mic) */}
        <div className="pt-4 pb-2 sticky bottom-0 bg-[#f4f6f4]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 bg-white border border-gray-300 rounded-full px-4 py-1.5 shadow-sm"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={strings.placeholder}
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none py-2"
            />

            {input.trim() ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#165b33] text-white flex items-center justify-center shrink-0 hover:bg-[#124828] transition-all"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={toggleRecording}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#165b33] text-white hover:bg-[#124828]'
                }`}
                title="Speak in your language"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
          </form>
        </div>

      </main>
    </div>
  );
}
