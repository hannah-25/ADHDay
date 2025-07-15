"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pill, Plus, Clock, Info, AlertCircle, CheckCircle } from "lucide-react"

const predefinedMedications = [
  {
    name: "콘서타 (Concerta)",
    ingredient: "메틸페니데이트 서방정",
    mechanism: "도파민과 노르에피네프린 재흡수 억제",
    benefits: ["집중력 향상", "충동성 감소", "과잉행동 조절", "12시간 지속 효과"],
    sideEffects: ["식욕 감소", "불면증", "두통", "성장 지연(소아)"],
    dosages: ["18mg", "27mg", "36mg", "54mg"],
  },
  {
    name: "메틸페니데이트 속방정",
    ingredient: "메틸페니데이트",
    mechanism: "도파민과 노르에피네프린 재흡수 억제",
    benefits: ["빠른 효과 발현", "용량 조절 용이", "단기간 집중력 향상"],
    sideEffects: ["식욕 감소", "불면증", "두통", "반동 효과"],
    dosages: ["5mg", "10mg", "20mg"],
  },
  {
    name: "아토목세틴 (Strattera)",
    ingredient: "아토목세틴",
    mechanism: "노르에피네프린 재흡수 억제",
    benefits: ["24시간 지속 효과", "중독성 없음", "감정 조절 개선"],
    sideEffects: ["졸음", "위장 장애", "성기능 장애", "간독성(드물게)"],
    dosages: ["10mg", "18mg", "25mg", "40mg", "60mg"],
  },
]

export default function MedicationManager() {
  const [currentMedications, setCurrentMedications] = useState<Array<{
    id: number,
    name: string,
    dosage: string,
    times: string[],
    active: boolean
  }>>([])
  const [selectedMedInfo, setSelectedMedInfo] = useState(predefinedMedications[0])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    time1: "",
    time2: ""
  })

  // localStorage에서 약물 목록 불러오기
  useEffect(() => {
    const savedMedications = localStorage.getItem('userMedications')
    if (savedMedications) {
      try {
        const parsed = JSON.parse(savedMedications)
        setCurrentMedications(parsed)
      } catch (error) {
        console.error('약물 목록 파싱 실패:', error)
      }
    }
  }, [])

  // 약물 목록을 localStorage에 저장
  const saveMedications = (medications: typeof currentMedications) => {
    localStorage.setItem('userMedications', JSON.stringify(medications))
    // 대시보드에서 사용할 수 있도록 간단한 형태로도 저장
    const simpleMedications = medications.map(med => ({
      name: med.name,
      dosage: med.dosage
    }))
    localStorage.setItem('userMedications', JSON.stringify(simpleMedications))
  }

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) return

    const times = [newMedication.time1]
    if (newMedication.time2) times.push(newMedication.time2)

    const newMed = {
      id: Date.now(),
      name: newMedication.name,
      dosage: newMedication.dosage,
      times,
      active: true
    }

    const updatedMedications = [...currentMedications, newMed]
    setCurrentMedications(updatedMedications)
    saveMedications(updatedMedications)
    
    setNewMedication({ name: "", dosage: "", time1: "", time2: "" })
    setShowAddDialog(false)
  }

  const handleDeleteMedication = (id: number) => {
    const updatedMedications = currentMedications.filter(med => med.id !== id)
    setCurrentMedications(updatedMedications)
    saveMedications(updatedMedications)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-6 h-6" />
            약물 관리
          </CardTitle>
          <CardDescription>복용 중인 약물을 관리하고 상세 정보를 확인하세요</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">현재 복용 약물</TabsTrigger>
          <TabsTrigger value="info">약물 정보</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {/* 현재 복용 약물 목록 */}
          <div className="space-y-4">
            {currentMedications.length === 0 ? (
              <Card key="no-med-placeholder">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">복용 중인 약물이 없습니다</h3>
                    <p className="text-gray-600 mb-4">아래 버튼을 눌러 복용할 약물을 추가해주세요</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              currentMedications.map((med) => (
              <Card key={med.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{med.name}</h3>
                        <p className="text-sm text-gray-600">{med.dosage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{Array.isArray(med.times) && med.times.length > 0 ? med.times.join(", ") : "시간 정보 없음"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={med.active ? "default" : "secondary"}>{med.active ? "복용 중" : "중단"}</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteMedication(med.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>

          {/* 새 약물 추가 */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="w-full" onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />새 약물 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>새 약물 추가</DialogTitle>
                <DialogDescription>복용할 약물 정보를 입력해주세요</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="med-name">약물명</Label>
                  <Select onValueChange={(value) => setNewMedication({...newMedication, name: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="약물을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedMedications.map((med) => (
                        <SelectItem key={med.name} value={med.name}>
                          {med.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dosage">용량</Label>
                  <Input 
                    id="dosage" 
                    placeholder="예: 18mg"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time1">복용 시간 1</Label>
                  <Input 
                    id="time1" 
                    type="time"
                    value={newMedication.time1}
                    onChange={(e) => setNewMedication({...newMedication, time1: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time2">복용 시간 2 (선택)</Label>
                  <Input 
                    id="time2" 
                    type="time"
                    value={newMedication.time2}
                    onChange={(e) => setNewMedication({...newMedication, time2: e.target.value})}
                  />
                </div>
                <Button className="w-full" onClick={handleAddMedication}>
                  추가
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 오늘의 복용 현황 */}
          {currentMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">오늘의 복용 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">콘서타 18mg</p>
                        <p className="text-sm text-gray-600">08:00 복용 완료</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      완료
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium">콘서타 18mg</p>
                        <p className="text-sm text-gray-600">14:00 복용 예정</p>
                      </div>
                    </div>
                    <Button size="sm">복용 체크</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          {/* 약물 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">약물 정보 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={(value) => {
                  const med = predefinedMedications.find((m) => m.name === value)
                  if (med) setSelectedMedInfo(med)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="약물을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedMedications.map((med) => (
                    <SelectItem key={med.name} value={med.name}>
                      {med.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* 선택된 약물 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                {selectedMedInfo.name}
              </CardTitle>
              <CardDescription>{selectedMedInfo.ingredient}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">작용 기전</h4>
                <p className="text-sm text-gray-600">{selectedMedInfo.mechanism}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-green-700">주요 효과</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMedInfo.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-orange-700">주요 부작용</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMedInfo.sideEffects.map((effect, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">사용 가능한 용량</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMedInfo.dosages.map((dosage, index) => (
                    <Badge key={index} variant="secondary">
                      {dosage}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">주의사항</p>
                    <p className="text-sm text-blue-700 mt-1">
                      처방된 용량과 시간을 정확히 지켜주세요. 부작용이 발생하면 즉시 의료진에게 연락하시기 바랍니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
