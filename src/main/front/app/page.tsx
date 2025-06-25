"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Pill, Brain, TrendingUp, FileText } from "lucide-react"
import Dashboard from "@/components/dashboard"
import SelfAssessment from "@/components/self-assessment"
import DailyLog from "@/components/daily-log"
import MedicationManager from "@/components/medication-manager"
import Statistics from "@/components/statistics"
import ConsultationPrep from "@/components/consultation-prep"

export default function ADHDayApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ADHDay</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ADHD인의 증상과 감정 상태, 약물 복용 효과를 기록하고 분석하여 더 나은 일상을 만들어가는 여정을 함께합니다
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="assessment" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              자가진단
            </TabsTrigger>
            <TabsTrigger value="daily-log" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              일지작성
            </TabsTrigger>
            <TabsTrigger value="medication" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              약물관리
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              통계
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              상담준비
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="assessment">
            <SelfAssessment />
          </TabsContent>

          <TabsContent value="daily-log">
            <DailyLog />
          </TabsContent>

          <TabsContent value="medication">
            <MedicationManager />
          </TabsContent>

          <TabsContent value="statistics">
            <Statistics />
          </TabsContent>

          <TabsContent value="consultation">
            <ConsultationPrep />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
