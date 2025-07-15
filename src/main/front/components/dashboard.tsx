"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Bell, CheckCircle, AlertCircle, TrendingUp, Calendar, Pill, Brain, Clock } from "lucide-react"
import React from "react"

interface MedicationRecord {
  id: string
  date: string
  time: string
  medication: string
  dosage: string
  notes: string
}

interface DashboardProps {
  onReportClick?: () => void;
  onConsultationClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onReportClick, onConsultationClick }) => {
  const [showMedicationForm, setShowMedicationForm] = useState(false)
  const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([])
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    notes: ""
  })
  const [userMedications, setUserMedications] = useState<Array<{name: string, dosage: string}>>([])

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  useEffect(() => {
    // localStorage에서 복용 기록 불러오기
    const savedRecords = localStorage.getItem('medicationRecords')
    if (savedRecords) {
      try {
        setMedicationRecords(JSON.parse(savedRecords))
      } catch (error) {
        console.error('복용 기록 파싱 실패:', error)
      }
    }

    // localStorage에서 사용자 약물 목록 불러오기
    const savedMedications = localStorage.getItem('userMedications')
    if (savedMedications) {
      try {
        setUserMedications(JSON.parse(savedMedications))
      } catch (error) {
        console.error('사용자 약물 목록 파싱 실패:', error)
      }
    }
  }, [])

  const handleRecordMedication = () => {
    if (!formData.medication.trim()) {
      alert('약물명을 입력해주세요.')
      return
    }

    const newRecord: MedicationRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      medication: formData.medication,
      dosage: formData.dosage,
      notes: formData.notes
    }

    const updatedRecords = [newRecord, ...medicationRecords]
    setMedicationRecords(updatedRecords)
    localStorage.setItem('medicationRecords', JSON.stringify(updatedRecords))

    // 폼 초기화
    setFormData({ medication: "", dosage: "", notes: "" })
    setShowMedicationForm(false)

    alert('복용 기록이 저장되었습니다!')
  }

  const todayRecords = medicationRecords.filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  )

  const handleSelectMedication = (medication: {name: string, dosage: string}) => {
    setFormData({
      medication: medication.name,
      dosage: medication.dosage,
      notes: ""
    })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">안녕하세요! 👋</CardTitle>
          <CardDescription className="text-blue-100">{today} - 오늘도 함께 성장해나가요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-2">오늘의 진행률</p>
              <Progress value={65} className="bg-blue-400" />
            </div>
            <Badge variant="secondary" className="bg-white text-blue-600">
              65% 완료
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 상단 주요 카드 3열 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* 약물 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              약물 관리
            </CardTitle>
            <CardDescription>약물 복용 기록 및 관리</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => window.open('/medication', '_blank')}>약물 관리</Button>
            <Button className="w-full" onClick={() => setShowMedicationForm(true)}>약 먹었나요?</Button>
          </CardContent>
        </Card>

        {/* 일지 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              일지 관리
            </CardTitle>
            <CardDescription>일지 작성 및 기록 확인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => window.open('/daily-log', '_blank')}>일지 작성</Button>
            <Button className="w-full" variant="outline" onClick={() => window.open('/daily-log/history', '_blank')}>최근 기록 보기</Button>
          </CardContent>
        </Card>

        {/* 나도 ADHD일까? */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              나도 ADHD일까?
            </CardTitle>
            <CardDescription>ADHD 증상 자가진단과 결과 확인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => window.open('/assessment', '_blank')}>자가진단 하기</Button>
            <Button className="w-full" variant="outline" onClick={() => window.open('/assessment-results', '_blank')}>결과 보기</Button>
          </CardContent>
        </Card>
      </div>

      {/* 하단 주요 카드 3열 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 주간/월간 리포트 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">주간/월간 리포트</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline" onClick={onReportClick ? onReportClick : () => window.open('/statistics', '_blank')}>리포트 보기</Button>
            <Button className="w-full" variant="outline" onClick={onConsultationClick ? onConsultationClick : undefined}>상담 준비</Button>
          </CardContent>
        </Card>

        {/* 오늘의 알림 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              오늘의 알림
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">오후 약물 복용 시간</p>
                <p className="text-xs text-gray-600">14:00 - 콘서타 18mg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-sm">다음 상담 예약</p>
                <p className="text-xs text-gray-600">12월 30일 오후 2시</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 기록 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 기록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">어제 일지</p>
                <p className="text-xs text-gray-600">집중력 향상, 약간의 두통</p>
              </div>
              <Badge variant="outline">완료</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">약물 효과</p>
                <p className="text-xs text-gray-600">업무 실수 감소 8/10</p>
              </div>
              <Badge variant="outline">기록됨</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Form Modal */}
      {showMedicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                어떤 약을 먹었나요?
              </CardTitle>
              <CardDescription>복용한 약물 정보를 간단히 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userMedications.length > 0 ? (
                <>
                  <div>
                    <Label>복용할 약물 선택</Label>
                    <div className="space-y-2 mt-2">
                      {userMedications.map((med, index) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            formData.medication === med.name 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleSelectMedication(med)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-gray-600">{med.dosage}</p>
                            </div>
                            {formData.medication === med.name && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {formData.medication && (
                    <div>
                      <Label htmlFor="notes">메모 (선택사항)</Label>
                      <Textarea
                        id="notes"
                        placeholder="복용 후 느낀 효과나 특이사항을 기록해주세요"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        rows={3}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <Pill className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 mb-4">설정된 약물이 없습니다</p>
                  <p className="text-sm text-gray-500 mb-4">약물 관리에서 복용할 약물을 먼저 설정해주세요</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('/medication', '_blank')}
                  >
                    약물 관리에서 설정하기
                  </Button>
                </div>
              )}
              {userMedications.length > 0 && (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRecordMedication} 
                    className="flex-1"
                    disabled={!formData.medication}
                  >
                    완료!
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowMedicationForm(false)
                      setFormData({ medication: "", dosage: "", notes: "" })
                    }}
                    className="flex-1"
                  >
                    나중에
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Today's Medication Summary */}
      {todayRecords.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              오늘 먹은 약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium">{record.medication}</p>
                      {record.dosage && <p className="text-sm text-gray-600">{record.dosage}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {record.time}
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      복용완료
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
