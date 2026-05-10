/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Zap, TrendingUp, MessageSquare, AlertCircle, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API (accessed via process.env injected by Vite define)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default function App() {
  const [tweets, setTweets] = useState("");
  const [analysis, setAnalysis] = useState<{ mood: string; summary: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMood = async () => {
    if (!tweets.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Direct call to Gemini from the frontend as per system instructions
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                text: `Analyze the following block of tweets about the RR vs GT IPL match. 
                Return exactly ONE mood emoji followed by a witty, hyper-energetic summary in the voice of a veteran Jodhpuri cricket commentator (max 30 words).
                Focus on the match intensity, RR's Pink Promise Day (solar energy initiative), and the rivalry.
                
                Tweets:
                ${tweets}`,
              },
            ],
          },
        ],
      });

      const text = response.text || "";
      const match = text.match(/([\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}|[\u2600-\u27BF])\s*(.*)/u);

      setAnalysis({
        mood: match ? match[1] : "🔥",
        summary: match ? match[2].trim() : text.trim() || "The stadium is roaring, but the commentary is silent!",
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("API key not valid")) {
        setError("Invalid API Key: Please update the GEMINI_API_KEY in the Secrets panel (Settings > Secrets).");
      } else {
        setError("The AI is taking a chai break! Check your internet or try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Header Section */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center border-b border-gray-800 pb-4"
        >
          <div className="flex items-center gap-4">
            <div className="bg-rr-pink text-[10px] font-bold px-2 py-1 rounded animate-pulse">LIVE</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic font-display">
              Fan-Mood <span className="text-rr-pink">Thermometer</span>
            </h1>
          </div>
          <div className="flex gap-8 items-baseline">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Venue</p>
              <p className="font-bold text-sm">Sawai Mansingh Stadium</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Match 24</p>
              <p className="font-bold text-sm text-gt-gold">RR vs GT</p>
            </div>
          </div>
        </motion.header>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
          
          {/* Match Snapshot Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-12 bento-surface p-4 flex flex-wrap justify-between items-center bg-gt-gold/5 border-gt-gold/20"
          >
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] text-gt-gold uppercase font-bold tracking-widest leading-none mb-1">Match Result (May 9, 2026)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-display font-black italic">GT WON BY 77 RUNS</p>
                  <span className="text-[10px] text-white/30 font-bold uppercase">Final</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-none mb-1">Player of the Match</p>
                <p className="text-sm font-bold text-white/90">Rashid Khan <span className="text-gt-gold font-black tracking-tighter ml-1">4/33</span></p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div className="hidden lg:block">
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-none mb-1">Toss Action</p>
                <p className="text-xs font-bold text-rr-pink">RR WON (ELECTED TO BOWL)</p>
              </div>
              <div className="px-3 py-1 bg-rr-pink text-[10px] font-black rounded italic italic">SOLAR PULSE ACTIVE</div>
            </div>
          </motion.div>
          
          {/* Mood Thermometer Card (col-span-4 row-span-4) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 md:row-span-4 bento-surface bg-gradient-to-b from-[#1a1a1a] to-transparent flex flex-col items-center justify-between min-h-[500px]"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={120} className="text-rr-pink" />
            </div>
            <h3 className="uppercase text-[10px] tracking-[0.3em] text-rr-pink font-bold self-start mb-8">Current Vibe State</h3>
            
            <div className="flex flex-col items-center gap-6">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={analysis?.mood || "default"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {analysis?.mood || "🔥"}
                </motion.span>
              </AnimatePresence>
              
              <div className="h-48 w-4 bg-gray-900 rounded-full relative">
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: analysis ? "85%" : "40%" }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-rr-pink to-[#ff6fb1] rounded-full shadow-[0_0_20px_#EB1165]"
                />
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-4xl font-black italic font-display uppercase tracking-tight">
                {analysis ? "Electrifying" : "Neutral"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest leading-none">
                {analysis ? "85% Fan Sentiment Intensity" : "Awaiting Crowd Surge"}
              </p>
            </div>
          </motion.div>

          {/* AI Commentary Output (col-span-8 row-span-3) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 md:row-span-3 bg-[#111] border-l-4 border-gt-gold rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center min-h-[240px]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gt-gold flex items-center justify-center text-black font-bold italic text-xl font-display">J</div>
                <div>
                  <p className="text-sm font-bold">Jodhpuri Cricket Guru</p>
                  <p className="text-[10px] text-gt-gold uppercase tracking-widest font-bold">AI Analysis Voice</p>
                </div>
              </div>
              <div className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 font-bold">v2.5 FLASH</div>
            </div>
            
            <div className="flex-1 flex items-center">
              {loading ? (
                <div className="flex items-center gap-3 text-white/50 italic">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Decoding the stadium roar...</span>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-serif italic leading-tight text-gray-200">
                  {analysis 
                    ? `\"${analysis.summary}\"` 
                    : "\"Arre bhai! Paste those tweets so I can tell you if the stadium is vibrating harder than a desert storm!\""}
                </p>
              )}
            </div>
            
            <div className="mt-6 flex gap-4 border-t border-white/5 pt-4">
              <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                SENTIMENT: {analysis ? "POSITIVE" : "---"}
              </span>
              <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">
                BIAS: {analysis ? "PRO-ROYALS" : "---"}
              </span>
            </div>
          </motion.div>

          {/* Pink Promise Solar Dashboard (col-span-8 row-span-3) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-8 md:row-span-3 bg-gradient-to-br from-[#0a0a0a] to-[#250412] border border-rr-pink/30 rounded-2xl p-8 flex flex-col justify-between shadow-[inset_0_0_40px_rgba(235,17,101,0.1)] min-h-[300px]"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-rr-pink tracking-tighter uppercase font-display">Pink Promise Day</h2>
                <p className="text-[10px] tracking-[0.2em] uppercase text-pink-300/60 font-bold">Sustainability Initiative</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-mono font-bold leading-none">06</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Sixes Hit Today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-pink-400 uppercase font-bold mb-1">Power Generated</p>
                <p className="text-2xl font-bold">2.4 kW</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-pink-400 uppercase font-bold mb-1">Homes Lit</p>
                <p className="text-2xl font-bold">36 Units</p>
              </div>
              <div className="bg-rr-pink p-4 rounded-xl shadow-lg relative overflow-hidden group">
                <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:scale-110 transition-transform">
                  <Sun size={60} />
                </div>
                <p className="text-[10px] text-white uppercase font-bold mb-1 italic">Next Six Hits</p>
                <p className="text-2xl font-bold">Village #4</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rr-pink">Progress: 100 Homes Goal</span>
                <span className="text-[10px] text-white/40">36%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "36%" }}
                  className="h-full bg-rr-pink" 
                />
              </div>
            </div>
          </motion.div>

          {/* Tweet Input Area (col-span-4 row-span-2) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 md:row-span-2 bg-[#151515] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 min-h-[240px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
                <TrendingUp size={12} /> Feed the AI
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rr-pink animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
              </div>
            </div>
            
            <textarea
              className="flex-1 bg-black rounded-xl p-4 text-xs font-mono text-gray-400 border border-gray-800 focus:outline-none focus:border-rr-pink/50 transition-all resize-none placeholder:text-gray-700"
              placeholder="Paste Tweets here... #RRvGT #HallaBol #PinkPromise"
              value={tweets}
              onChange={(e) => setTweets(e.target.value)}
            />
            
            <button 
              onClick={analyzeMood}
              disabled={loading || !tweets.trim()}
              className="w-full py-3 bg-white text-black font-black uppercase text-xs rounded-lg hover:bg-gt-gold hover:text-black transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze Mood"}
            </button>
          </motion.div>

        </div>

        {/* Footer Bar */}
        <footer className="flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-[0.4em] pt-8 border-t border-gray-800 pb-12">
          <p className="hidden sm:block">Powered by Gemini 2.5 Flash & Solar Energy</p>
          <p>© 2026 IPL Fan Experience Lab</p>
          <p>Halla Bol • Aava De</p>
        </footer>
      </div>
    </div>
  );
}
