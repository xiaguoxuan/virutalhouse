"use client"

import { useState } from "react"
import { ArrowLeft, Download, Share2, Copy, ExternalLink, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ResultPageProps {
  originalImage: string
  generatedImage: string
  onReset: () => void
}

// 模拟数据
const mockItems = [
  {
    category: "sofa_cover",
    title: "沙发套/沙发巾",
    spec: "奶油白/米白；防滑；全包或坐垫+靠背；可机洗",
    tips: "优先选“防滑+可机洗”，颜色选奶油白/米白，避免冷白。",
    search_terms: {
      tmall: "奶油白 沙发套 防滑 四季通用 全包 现代简约",
      jd: "沙发套 奶油白 防滑 四季通用 全包",
      pdd: "沙发套 奶油白 防滑 全包 机洗",
    },
  },
  {
    category: "rug",
    title: "地毯",
    spec: "160x230 或 200x300；米灰/奶油白；低纹理；短绒易打理",
    tips: "短绒/易清洁更适合租房；尺寸宁大不小（200x300更像样）。",
    search_terms: {
      tmall: "法式奶油风 客厅地毯 米灰 低纹理 200x300 短绒",
      jd: "奶油风 客厅地毯 米灰 简约 200*300 短绒",
      pdd: "奶油风 地毯 米灰 低纹理 200x300 易打理",
    },
  },
  {
    category: "coffee_table",
    title: "茶几/茶几桌面替代",
    spec: "圆形/椭圆；小户型；浅木/奶油白；圆角",
    tips: "选圆角小体量，过大容易挡动线；浅木更奶油。",
    search_terms: {
      tmall: "奶油风 茶几 圆形 小户型 浅木 圆角",
      jd: "圆形茶几 奶油风 小户型 浅木 圆角",
      pdd: "奶油风 茶几 圆形 小户型 浅木",
    },
  },
  {
    category: "side_table",
    title: "边几/小圆几",
    spec: "直径40-50cm；圆形；轻便；浅木/奶油白/低对比黑",
    tips: "选轻便可移动的，放落地灯/水杯最实用。",
    search_terms: {
      tmall: "奶油风 边几 小圆几 轻奢 圆形 小户型",
      jd: "小圆几 边几 奶油风 圆形 轻便",
      pdd: "边几 小圆几 奶油风 圆形",
    },
  },
  {
    category: "ceiling_light",
    title: "主灯/灯泡替代",
    spec: "暖光2700-3000K；高显指；简洁吸顶/吊灯",
    tips: "租房不方便换灯就先换“暖光高显指灯泡”，氛围立刻提升。",
    search_terms: {
      tmall: "奶油风 客厅灯 吸顶灯 简约 暖光 3000K",
      jd: "吸顶灯 简约 客厅 暖光 3000K 奶油风",
      pdd: "简约 吸顶灯 客厅 暖光 3000K",
    },
  },
  {
    category: "floor_lamp",
    title: "落地灯",
    spec: "弧形/三脚；布艺灯罩；暖光；阅读氛围",
    tips: "选布艺灯罩+暖光，晚上比顶灯更奶油。",
    search_terms: {
      tmall: "奶油风 落地灯 客厅 弧形 布艺灯罩 暖光",
      jd: "落地灯 客厅 弧形 布艺灯罩 暖光",
      pdd: "落地灯 弧形 布艺灯罩 暖光 客厅",
    },
  },
  {
    category: "curtain",
    title: "窗帘（免打孔）",
    spec: "免打孔伸缩杆；纱帘+遮光；米白/暖灰；落地",
    tips: "优先“免打孔伸缩杆”，纱+遮光两层最耐看。",
    search_terms: {
      tmall: "免打孔 伸缩杆 窗帘 纱帘 遮光 米白 落地",
      jd: "免打孔伸缩杆 窗帘 米白 纱帘 遮光",
      pdd: "免打孔 伸缩杆 窗帘 米白 纱帘 遮光",
    },
  },
  {
    category: "wall_art",
    title: "装饰画/墙面装饰",
    spec: "抽象线条/几何；低饱和；无痕贴；2-3联",
    tips: "选低饱和抽象，2-3幅组合更像样板间；无痕贴更友好。",
    search_terms: {
      tmall: "奶油风 装饰画 抽象 低饱和 无痕贴 三联",
      jd: "装饰画 抽象 低饱和 无痕贴 奶油风",
      pdd: "装饰画 抽象 低饱和 无痕贴",
    },
  },
  {
    category: "pillows_throw",
    title: "抱枕/盖毯",
    spec: "抱枕45x45；奶油白/米杏；少量焦糖点缀；盖毯柔软",
    tips: "用同色系叠层，点缀1个焦糖色即可，别太花。",
    search_terms: {
      tmall: "奶油风 抱枕套 45x45 米杏 奶油白 焦糖",
      jd: "抱枕套 45x45 奶油风 米杏 奶油白",
      pdd: "抱枕套 45x45 奶油风 米杏",
    },
  },
  {
    category: "decor_plants",
    title: "花瓶摆件/仿真绿植",
    spec: "奶油白陶瓷花瓶；少量；仿真枝叶/尤加利",
    tips: "少量就好，奶油白陶瓷+一支枝叶最出片。",
    search_terms: {
      tmall: "奶油风 花瓶 陶瓷 奶油白 摆件 尤加利",
      jd: "陶瓷花瓶 奶油白 摆件 奶油风 尤加利",
      pdd: "花瓶 陶瓷 奶油白 奶油风 摆件",
    },
  },
]

export default function ResultPage({ originalImage, generatedImage, onReset }: ResultPageProps) {
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
          <span className="text-sm text-muted-foreground">{mockItems.length} 件单品</span>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {mockItems.map((item, index) => (
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
              const allTerms = mockItems
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
  item: (typeof mockItems)[0]
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
