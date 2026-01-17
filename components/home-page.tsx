"use client"

import type React from "react"

import { useRef } from "react"
import { Camera, ImagePlus, Sparkles, Home, Sofa, Lamp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HomePageProps {
  onImageUpload: (file: File, previewUrl: string) => void
}

export default function HomePage({ onImageUpload }: HomePageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageUpload(file, url)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">软装焕新</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 px-5 pt-6 pb-8 flex flex-col">
        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground leading-tight mb-2">
            租房也能住出
            <span className="text-primary">高级感</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            上传客厅照片，AI 一键生成法式奶油风效果图
            <br />
            附赠软装购物清单，不拆不砸轻松焕新
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary mx-auto mb-2 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">保留原有格局</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary mx-auto mb-2 flex items-center justify-center">
              <Sofa className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">软装焕新方案</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary mx-auto mb-2 flex items-center justify-center">
              <Lamp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">购物清单直达</p>
          </div>
        </div>

        {/* Preview Image */}
        <div className="relative rounded-3xl overflow-hidden mb-6 aspect-[4/3] bg-muted">
          <img src="/french-cream-style-living-room-interior-design-coz.jpg" alt="法式奶油风客厅效果图" className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-accent border-2 border-card" />
                <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card" />
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-card" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">2,847 人已体验</p>
                <p className="text-xs text-muted-foreground">平均满意度 4.8 分</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3 h-3 text-accent fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Style Tag */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
            🧈 法式奶油风
          </span>
          <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs">租房友好</span>
          <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs">免费体验</span>
        </div>

        {/* Upload Buttons */}
        <div className="space-y-3 mt-auto">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-14 rounded-2xl text-base font-medium bg-primary hover:bg-primary/90"
          >
            <ImagePlus className="w-5 h-5 mr-2" />
            上传客厅照片
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.capture = "environment"
                fileInputRef.current.click()
              }
            }}
            className="w-full h-14 rounded-2xl text-base font-medium border-2"
          >
            <Camera className="w-5 h-5 mr-2" />
            拍照上传
          </Button>
        </div>
      </div>
    </div>
  )
}
