"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Upload, Repeat, Music, Volume2, Clock } from "lucide-react"

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>("")

  // Loop controls
  const [loopStart, setLoopStart] = useState(0)
  const [loopEnd, setLoopEnd] = useState(0)
  const [isLooping, setIsLooping] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setLoopEnd(audio.duration)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [audioFile])

  // Handle looping
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isLooping) return

    const checkLoop = () => {
      if (audio.currentTime >= loopEnd) {
        audio.currentTime = loopStart
      }
    }

    audio.addEventListener("timeupdate", checkLoop)
    return () => audio.removeEventListener("timeupdate", checkLoop)
  }, [isLooping, loopStart, loopEnd])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioFile(url)
      setFileName(file.name)
      setIsPlaying(false)
      setCurrentTime(0)
      setLoopStart(0)
      setLoopEnd(0)
    }
  }

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handlePlaybackRateChange = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const rate = value[0]
    audio.playbackRate = rate
    setPlaybackRate(rate)
  }

  const setLoopStartToCurrent = () => {
    setLoopStart(currentTime)
  }

  const setLoopEndToCurrent = () => {
    setLoopEnd(currentTime)
  }

  const resetPosition = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web Music Player
            </h1>
          </div>
          <p className="text-slate-400">Audio control with precision timing</p>
        </div>

        {/* Horizontal Layout - Only show when file is loaded */}
        {!audioFile ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-fit">
                  <Music className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Upload Your Audio</h2>
                  <p className="text-slate-400">Get started by selecting an audio file to analyze and control</p>
                </div>
              </div>

              <div className="relative">
                <Input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-32 border-dashed border-2 border-slate-600 hover:border-purple-400 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-700/50 rounded-full">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">Choose Audio File</div>
                      <div className="text-sm text-slate-400 mt-1">Drag & drop or click to browse</div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Position Control</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span>Speed Control</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Loop Sections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Main Player */}
            <div className="col-span-2 space-y-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 space-y-6">
                  {/* File Upload Section (minimalist when loaded) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-purple-400" />
                      <Label htmlFor="audio-file" className="text-lg font-semibold text-slate-200">
                        Audio File
                      </Label>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-green-400" />
                        <span className="text-slate-200 font-medium">{fileName}</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Loaded
                        </Badge>
                      </div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-slate-200"
                      >
                        Change
                      </Button>
                      <Input
                        id="audio-file"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <audio ref={audioRef} src={audioFile} />

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 font-mono text-lg">{formatTime(currentTime)}</span>
                      </div>
                      <div className="text-slate-400 font-mono text-lg">{formatTime(duration)}</div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="relative">
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                      <Slider
                        value={[currentTime]}
                        max={duration}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center justify-center gap-8 py-4">
                    <Button
                      onClick={resetPosition}
                      variant="outline"
                      size="lg"
                      className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </Button>

                    <Button
                      onClick={togglePlayPause}
                      size="lg"
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
                    >
                      {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                    </Button>

                    <Button
                      onClick={() => setIsLooping(!isLooping)}
                      variant={isLooping ? "default" : "outline"}
                      size="lg"
                      className={
                        isLooping
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : "border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-300"
                      }
                    >
                      <Repeat className="w-6 h-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Speed Control Section */}
              {audioFile && (
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                      <h3 className="text-xl font-semibold text-slate-200">Playback Speed</h3>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {playbackRate.toFixed(2)}x
                      </Badge>
                    </div>

                    <div className="relative">
                      <Slider
                        value={[playbackRate]}
                        min={0.2}
                        max={1.8}
                        step={0.05}
                        onValueChange={handlePlaybackRateChange}
                        className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-500 [&_[role=slider]]:to-pink-500 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-purple-500 [&_.bg-primary]:to-pink-500"
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>0.2x</span>
                      <span>0.6x</span>
                      <span className="font-semibold text-purple-400">1.0x</span>
                      <span>1.4x</span>
                      <span>1.8x</span>
                    </div>

                    {/* Speed Preset Buttons */}
                    <div className="grid grid-cols-6 gap-2">
                      {[0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 0.9, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                        <Button
                          key={speed}
                          onClick={() => handlePlaybackRateChange([speed])}
                          variant={playbackRate === speed ? "default" : "outline"}
                          size="sm"
                          className={
                            playbackRate === speed
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                              : "border-slate-600 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300 text-xs"
                          }
                        >
                          {speed}x
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Loop Controls */}
            {audioFile && (
              <div className="col-span-1">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-3 text-slate-200">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Repeat className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div>Loop Control</div>
                        {isLooping && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-1">Active</Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="text-slate-300 font-medium">
                          Loop Start: <span className="font-mono text-green-400">{formatTime(loopStart)}</span>
                        </Label>
                        <Button
                          onClick={setLoopStartToCurrent}
                          variant="outline"
                          className="w-full border-slate-600 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300"
                        >
                          Set Current as Start
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-slate-300 font-medium">
                          Loop End: <span className="font-mono text-green-400">{formatTime(loopEnd)}</span>
                        </Label>
                        <Button
                          onClick={setLoopEndToCurrent}
                          variant="outline"
                          className="w-full border-slate-600 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300"
                        >
                          Set Current as End
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-slate-300 font-medium">Loop Range Sliders</Label>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>Start</span>
                            <span>{formatTime(loopStart)}</span>
                          </div>
                          <Slider
                            value={[loopStart]}
                            max={duration}
                            step={0.1}
                            onValueChange={(value) => setLoopStart(value[0])}
                            className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-500 [&_[role=slider]]:to-emerald-500 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-green-500 [&_.bg-primary]:to-emerald-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-400 mb-2">
                            <span>End</span>
                            <span>{formatTime(loopEnd)}</span>
                          </div>
                          <Slider
                            value={[loopEnd]}
                            max={duration}
                            step={0.1}
                            onValueChange={(value) => setLoopEnd(value[0])}
                            className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-500 [&_[role=slider]]:to-emerald-500 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-green-500 [&_.bg-primary]:to-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <Label className="text-slate-300 font-medium">Enable Loop</Label>
                      <Button
                        onClick={() => setIsLooping(!isLooping)}
                        variant={isLooping ? "default" : "outline"}
                        className={
                          isLooping
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                            : "border-slate-600 bg-slate-800/30 hover:bg-slate-700/50 text-slate-300"
                        }
                      >
                        {isLooping ? "ON" : "OFF"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
