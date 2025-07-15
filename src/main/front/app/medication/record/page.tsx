"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Clock, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface MedicationRecord {
  id: string
  date: string
  time: string
  medication: string
  dosage: string
  notes: string
}

export default function MedicationRecordPage() {
  const router = useRouter()
  const [records, setRecords] = useState<MedicationRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    notes: ""
  })

  useEffect(() => {
    // localStorage에서 복용 기록 불러오기
    const savedRecords = localStorage.getItem('medicationRecords')
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords))
      } catch (error) {
        console.error('복용 기록 파싱 실패:', error)
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

    const updatedRecords = [newRecord, ...records]
    setRecords(updatedRecords)
    localStorage.setItem('medicationRecords', JSON.stringify(updatedRecords))

    // 폼 초기화
    setFormData({ medication: "", dosage: "", notes: "" })
    setShowForm(false)

    alert('복용 기록이 저장되었습니다!')
  }

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  const todayRecords = records.filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4 max-w-4xl">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">약 먹었나요?</h1>
          <p className="text-gray-600">
            오늘 약을 먹었는지 확인하고 복용 시간을 기록해보세요
          </p>
        </div>

        {/* Today's Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              오늘 약 먹었나요?
            </CardTitle>
            <CardDescription>{today}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오늘 복용 횟수</p>
                <p className="text-2xl font-bold text-blue-600">{todayRecords.length}회</p>
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2"
                variant={todayRecords.length > 0 ? "outline" : "default"}
              >
                <CheckCircle className="w-4 h-4" />
                {todayRecords.length > 0 ? "추가 복용" : "약 먹었어요!"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Record Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>어떤 약을 먹었나요?</CardTitle>
              <CardDescription>복용한 약물 정보를 간단히 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="medication">약물명 *</Label>
                <Input
                  id="medication"
                  placeholder="예: 콘서타, 리탈린"
                  value={formData.medication}
                  onChange={(e) => setFormData({...formData, medication: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dosage">용량</Label>
                <Input
                  id="dosage"
                  placeholder="예: 18mg, 1정"
                  value={formData.dosage}
                  onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notes">메모</Label>
                <Textarea
                  id="notes"
                  placeholder="복용 후 느낀 효과나 특이사항을 기록해주세요"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRecordMedication} className="flex-1">
                  완료!
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  나중에
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Records */}
        {todayRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>오늘 먹은 약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
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

        {/* Recent Records */}
        {records.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>최근 복용 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{record.medication}</p>
                      {record.dosage && <p className="text-sm text-gray-600">{record.dosage}</p>}
                      {record.notes && <p className="text-sm text-gray-500 mt-1">{record.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString('ko-KR')}
                      </p>
                      <p className="text-sm text-gray-600">{record.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {records.length === 0 && !showForm && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">아직 오늘 약을 먹지 않았나요?</p>
              <Button onClick={() => setShowForm(true)}>
                약 먹었어요!
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 