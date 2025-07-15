"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import ConsultationPrep from "@/components/consultation-prep"

export default function ConsultationPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">상담 준비</h1>
          <p className="text-gray-600">
            다음 상담을 위한 준비사항을 정리하고 상담 효과를 극대화해보세요
          </p>
        </div>

        {/* Consultation Prep Component */}
        <ConsultationPrep />
      </div>
    </div>
  )
} 