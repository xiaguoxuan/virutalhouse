"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

export default function GeneratingPage() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { text: "分析空间结构...", emoji: "🏠" },
    { text: "识别现有家具...", emoji: "🛋️" },
    { text: "设计软装方案...", emoji: "✨" },
    { text: "生成效果图...", emoji: "🎨" },
    { text: "匹配购物清单...", emoji: "📋" },
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 80)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 800)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-accent flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-sm">{steps[currentStep].emoji}</span>
        </div>
      </div>

      {/* Progress Text */}
      <h2 className="text-xl font-semibold text-foreground mb-2">AI 正在创作中</h2>
      <p className="text-muted-foreground text-sm mb-8 text-center">{steps[currentStep].text}</p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-4">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-sm font-medium text-foreground">{progress}%</p>

      {/* Tips */}
      <div className="mt-12 bg-card rounded-2xl border border-border p-4 max-w-xs">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          💡 小贴士：软装焕新可以在不动硬装的情况下，快速提升空间氛围，特别适合租房党
        </p>
      </div>
    </div>
  )
}
