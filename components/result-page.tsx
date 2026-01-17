"use client"

import { useState } from "react"
import { ArrowLeft, Download, Share2, Copy, ExternalLink, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ResultPageProps {
  originalImage: string
  generatedImage: string
  items: SoftItem[]
  onReset: () => void
}

export type SoftItem = {
  category:
    | "sofa_cover"
    | "rug"
    | "coffee_table"
    | "side_table"
    | "ceiling_light"
    | "floor_lamp"
    | "curtain"
    | "wall_art"
    | "pillows_throw"
    | "decor_plants"
  title: string
  spec: string
  tips: string
  search_terms: {
    tmall: string
    jd: string
    pdd: string
  }
}

export default function ResultPage({ originalImage, generatedImage, items, onReset }: ResultPageProps) {
  const [showBefore, setShowBefore] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const afterImage = generatedImage || "/french-cream-style-living-room-interior-design-coz.jpg"

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={onReset} className="p-1">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">焕新效果</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-secondary">
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
          <button className="p-2 rounded-full bg-secondary">
            <Download className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="px-5 pt-5">
        {/* Before/After Comparison */}
        <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/3] bg-muted">
          <img
            src={showBefore ? originalImage : afterImage}
            alt={showBefore ? "原图" : "效果图"}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {/* Toggle Buttons */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex bg-card/90 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setShowBefore(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                showBefore ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              原图
            </button>
            <button
              onClick={() => setShowBefore(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                !showBefore ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              效果图
            </button>
          </div>
        </div>

        {/* Style Badge */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            🧈 法式奶油风客厅
          </span>
        </div>

        {/* Items List Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">软装购物清单</h2>
          <span className="text-sm text-muted-foreground">{items.length} 件单品</span>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <ItemCard
              key={item.category}
              item={item}
              index={index}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
              copiedIndex={copiedIndex}
              onCopy={handleCopy}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-secondary rounded-2xl">
          <p className="text-xs text-muted-foreground leading-relaxed">
            ⚠️
            免责声明：效果图仅供参考，实际效果可能因产品、光线、空间等因素而有所差异。搜索词为推荐用词，具体商品请自行甄选。
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border px-5 py-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onReset}
            className="flex-1 h-12 rounded-2xl text-base font-medium bg-transparent"
          >
            重新生成
          </Button>
          <Button
            className="flex-1 h-12 rounded-2xl text-base font-medium bg-primary hover:bg-primary/90"
            onClick={() => {
              const allTerms = items
                .map(
                  (item) =>
                    `【${item.title}】\n淘宝：${item.search_terms.tmall}\n京东：${item.search_terms.jd}\n拼多多：${item.search_terms.pdd}`,
                )
                .join("\n\n")
              navigator.clipboard.writeText(allTerms)
            }}
          >
            复制全部清单
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ItemCardProps {
  item: SoftItem
  index: number
  isExpanded: boolean
  onToggle: () => void
  copiedIndex: number | null
  onCopy: (text: string, index: number) => void
}

function ItemCard({ item, index, isExpanded, onToggle, copiedIndex, onCopy }: ItemCardProps) {
  const categoryEmojis: Record<string, string> = {
    sofa_cover: "🛋️",
    rug: "🟫",
    coffee_table: "☕",
    side_table: "🪑",
    ceiling_light: "💡",
    floor_lamp: "🪔",
    curtain: "🪟",
    wall_art: "🖼️",
    pillows_throw: "🛏️",
    decor_plants: "🌿",
  }

  const platforms = [
    { key: "tmall", name: "淘宝", color: "bg-[#FF5722]" },
    { key: "jd", name: "京东", color: "bg-[#E53935]" },
    { key: "pdd", name: "拼多多", color: "bg-[#E64A19]" },
  ] as const

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full px-4 py-3 flex items-center gap-3">
        <span className="text-xl">{categoryEmojis[item.category] || "📦"}</span>
        <div className="flex-1 text-left">
          <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{item.spec}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          {/* Tips */}
          {item.tips && (
            <div className="bg-accent/50 rounded-xl p-3 mb-3">
              <p className="text-xs text-muted-foreground">💡 {item.tips}</p>
            </div>
          )}

          {/* Platform Links */}
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform.key} className="flex items-center gap-2">
                <span className={cn("w-12 text-center py-1 rounded-lg text-xs font-medium text-card", platform.color)}>
                  {platform.name}
                </span>
                <p className="flex-1 text-xs text-muted-foreground truncate">{item.search_terms[platform.key]}</p>
                <button
                  onClick={() => onCopy(item.search_terms[platform.key], index * 10 + platforms.indexOf(platform))}
                  className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {copiedIndex === index * 10 + platforms.indexOf(platform) ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button className="p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
