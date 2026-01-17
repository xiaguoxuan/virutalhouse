"use client"

import { useState } from "react"
import HomePage from "@/components/home-page"
import ConfirmPage from "@/components/confirm-page"
import GeneratingPage from "@/components/generating-page"
import ResultPage from "@/components/result-page"

export type AppState = "home" | "confirm" | "generating" | "result"

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppState>("home")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null) // preview URL
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleImageUpload = (file: File, previewUrl: string) => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage)
    setUploadedFile(file)
    setUploadedImage(previewUrl)
    setGeneratedImage(null)
    setCurrentPage("confirm")
  }

  const handleGenerate = async () => {
    if (!uploadedFile) return

    setCurrentPage("generating")

    try {
      const formData = new FormData()
      formData.append("image", uploadedFile)

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "生成失败")
      }

      setGeneratedImage(data.imageUrl)
      setCurrentPage("result")
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : "生成失败，请重试")
      setCurrentPage("confirm")
    }
  }

  const handleReset = () => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage)
    setUploadedImage(null)
    setUploadedFile(null)
    setGeneratedImage(null)
    setCurrentPage("home")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentPage === "home" && <HomePage onImageUpload={handleImageUpload} />}
      {currentPage === "confirm" && uploadedImage && (
        <ConfirmPage imageUrl={uploadedImage} onGenerate={handleGenerate} onBack={handleReset} />
      )}
      {currentPage === "generating" && <GeneratingPage />}
      {currentPage === "result" && uploadedImage && generatedImage && (
        <ResultPage originalImage={uploadedImage} generatedImage={generatedImage} onReset={handleReset} />
      )}
    </main>
  )
}
