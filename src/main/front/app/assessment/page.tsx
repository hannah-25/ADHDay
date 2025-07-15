"use client"

import SelfAssessment from "@/components/self-assessment"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AssessmentPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">자가진단</h1>
          <p className="text-gray-600">
            ADHD, 불안, 우울 증상을 체계적으로 평가하고 치료 목표를 설정해보세요
          </p>
        </div>

        {/* Self Assessment Component */}
        <SelfAssessment />
      </div>
    </div>
  )
} 