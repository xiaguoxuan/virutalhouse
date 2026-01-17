"use client"

import { ArrowLeft, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmPageProps {
  imageUrl: string
  onGenerate: () => void | Promise<void>
  onBack: () => void
}

export default function ConfirmPage({ imageUrl, onGenerate, onBack }: ConfirmPageProps) {
  const tips = ["照片清晰、光线充足", "拍摄整体空间，不要太近", "避免过曝或过暗", "确保是客厅场景"]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">确认照片</h1>
      </header>

      <div className="flex-1 px-5 pb-8 flex flex-col">
        {/* Preview Image */}
        <div className="relative rounded-3xl overflow-hidden mb-6 aspect-[4/3] bg-muted">
          <img src={imageUrl || "/placeholder.svg"} alt="上传的客厅照片" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
              原图预览
            </span>
          </div>
        </div>

        {/* Style Info */}
        <div className="bg-accent/50 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🧈</span>
            <h3 className="font-semibold text-foreground">法式奶油风</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            奶油白配色、柔和暖光、浅木与布艺质感，打造温馨治愈的法式浪漫氛围
          </p>
        </div>

        {/* Tips */}
        <div className="bg-card rounded-2xl border border-border p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-foreground text-sm">拍摄建议</h3>
          </div>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Output Preview */}
        <div className="bg-secondary rounded-2xl p-4 mb-6">
          <h3 className="font-medium text-foreground text-sm mb-3">生成内容</h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-card rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🖼️</div>
              <p className="text-xs text-muted-foreground">效果图 × 1</p>
            </div>
            <div className="flex-1 bg-card rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">📋</div>
              <p className="text-xs text-muted-foreground">软装清单 × 10</p>
            </div>
            <div className="flex-1 bg-card rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔗</div>
              <p className="text-xs text-muted-foreground">购物直达</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={onGenerate}
            className="w-full h-14 rounded-2xl text-base font-medium bg-primary hover:bg-primary/90"
          >
            ✨ 开始生成效果图
          </Button>
          <p className="text-center text-xs text-muted-foreground">预计等待 30-60 秒</p>
        </div>
      </div>
    </div>
  )
}
