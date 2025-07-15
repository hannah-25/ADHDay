"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import MedicationManager from "@/components/medication-manager"

export default function MedicationPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">약물 관리</h1>
          <p className="text-gray-600">
            약물 복용 기록을 관리하고 복용 효과를 추적해보세요
          </p>
        </div>

        {/* Medication Manager Component */}
        <MedicationManager />
      </div>
    </div>
  )
} 