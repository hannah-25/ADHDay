"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import DailyLog from "@/components/daily-log"

export default function DailyLogPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로 가기
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">일지 작성</h1>
          <p className="text-gray-600">
            오늘의 감정과 상태를 기록하고 ADHD 증상을 추적해보세요
          </p>
        </div>

        {/* Daily Log Component */}
        <DailyLog />
      </div>
    </div>
  )
} 