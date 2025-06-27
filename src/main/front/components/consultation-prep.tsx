"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, FileText, Download, Clock, AlertCircle, TrendingUp } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ConsultationPrep() {
  const nextConsultation = "2024년 12월 30일 오후 2:00"

  const monthlyReport = {
    period: "2024년 12월",
    medicationCompliance: 87,
    averageEffectiveness: 7.3,
    majorSideEffects: ["가벼운 두통 (주 2-3회)", "식욕 감소"],
    improvements: ["업무 집중력 향상", "실수 빈도 감소"],
    concerns: ["주말 복용률 저하", "오후 3시경 약효 감소 느낌"],
  }

  const [preMemo, setPreMemo] = useState("")
  const [goals, setGoals] = useState("")
  const [doctorAdvice, setDoctorAdvice] = useState("")
  const [prescriptionChanges, setPrescriptionChanges] = useState("")
  const [nextGoals, setNextGoals] = useState("")

  const handleSave = () => {
    const data = { preMemo, goals }
    // 실제 저장 로직(예: 서버 전송) 대신 콘솔 출력
    console.log("상담준비 저장:", data)
    toast.success("상담 준비 내용이 저장되었습니다!")
  }

  const handleAfterSave = () => {
    const data = { doctorAdvice, prescriptionChanges, nextGoals }
    console.log("상담 후 기록 저장:", data)
    toast.success("상담 후 기록이 저장되었습니다!")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            상담 준비 도우미
          </CardTitle>
          <CardDescription>주치의 상담을 위한 자료를 자동으로 정리하고 준비하세요</CardDescription>
        </CardHeader>
      </Card>

      {/* 다음 상담 일정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            다음 상담 일정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium">{nextConsultation}</p>
              <p className="text-sm text-gray-600">김○○ 정신건강의학과 전문의</p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              예정
            </Badge>
          </div>
          <div className="mt-4">
            <Label htmlFor="consultation-date">상담 일정 수정</Label>
            <div className="flex gap-2 mt-2">
              <Input id="consultation-date" type="datetime-local" className="flex-1" />
              <Button variant="outline">수정</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 월간 종합 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            월간 종합 분석
          </CardTitle>
          <CardDescription>{monthlyReport.period} 복용 패턴과 효과를 종합 분석한 리포트입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">이번 달 성과</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">목표 달성률</span>
                  <Badge>{monthlyReport.medicationCompliance}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">일지 작성률</span>
                  <Badge>92%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">평균 약물 효과</span>
                  <Badge>{monthlyReport.averageEffectiveness}/10</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">다음 달 목표</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 부작용 모니터링 강화</p>
                <p>• 수면 패턴 개선</p>
                <p>• 정기 상담 일정 준수</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상담 질문 준비 */}
      <Card>
        <CardHeader>
          <CardTitle>상담 질문 및 메모</CardTitle>
          <CardDescription>의사에게 궁금한 점이나 상담하고 싶은 내용을 미리 정리해두세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pre-memo">상담 전 메모</Label>
            <Textarea
              id="pre-memo"
              placeholder={`상담 전 궁금한 점, 증상 변화, 의사에게 꼭 말하고 싶은 내용을 자유롭게 기록하세요.\n예: 오후 3시경 약효가 떨어지는 느낌, 최근 수면 패턴 변화 등`}
              className="min-h-[120px]"
              value={preMemo}
              onChange={e => setPreMemo(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="goals">다음 달 치료 목표</Label>
            <Textarea
              id="goals"
              placeholder="예: 업무 집중력을 더 향상시키고 싶습니다."
              className="min-h-[80px]"
              value={goals}
              onChange={e => setGoals(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="px-8 font-semibold">저장</Button>
          </div>
        </CardContent>
      </Card>

      {/* 상담 후 기록 */}
      <Card>
        <CardHeader>
          <CardTitle>상담 후 기록</CardTitle>
          <CardDescription>상담 후 의사의 조언이나 처방 변경 사항을 기록하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="doctor-advice">의사 조언</Label>
            <Textarea id="doctor-advice" placeholder="상담 후 작성해주세요" className="min-h-[100px]"
              value={doctorAdvice}
              onChange={e => setDoctorAdvice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="prescription-changes">처방 변경 사항</Label>
            <Textarea id="prescription-changes" placeholder="용량 변경, 복용 시간 조정 등" className="min-h-[80px]"
              value={prescriptionChanges}
              onChange={e => setPrescriptionChanges(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="next-goals">다음 상담까지의 목표</Label>
            <Textarea id="next-goals" placeholder="의사와 함께 설정한 목표를 기록하세요" className="min-h-[80px]"
              value={nextGoals}
              onChange={e => setNextGoals(e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleAfterSave} className="px-8 font-semibold">저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
