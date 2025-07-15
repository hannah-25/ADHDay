"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import AssessmentResults from "@/components/assessment-results"

export default function AssessmentResultsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">나도 ADHD일까? - 진단 결과</h1>
          <p className="text-gray-600">
            과거 자가진단 결과를 확인하고 변화 추이를 분석해보세요
          </p>
        </div>

        {/* Assessment Results Component */}
        <AssessmentResults />
      </div>
    </div>
  )
} 