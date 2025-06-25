"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Calendar, Pill, Heart, Brain, AlertTriangle } from "lucide-react"

export default function DailyLog() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [medicationTaken, setMedicationTaken] = useState(false)
  const [sleepHours, setSleepHours] = useState([7])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>([])
  const [selectedMistakes, setSelectedMistakes] = useState<string[]>([])
  const [customMistake, setCustomMistake] = useState("")
  const [customSideEffect, setCustomSideEffect] = useState("")
  const [personalGoalScores, setPersonalGoalScores] = useState<{ [key: number]: number }>({})
  const [notes, setNotes] = useState("")
  const [sideEffects, setSideEffects] = useState([
    "두통", "식욕 감소", "불안감", "불면증", "기분 변화"
  ])
  const [mistakeTags, setMistakeTags] = useState([
    "실수 투약 빠뜨림",
    "중요한 업무 깜빡함",
    "대화 중 집중력 저하",
    "물건 떨어뜨림/분실",
    "지각/늦잠",
    "충동적 구매",
    "업무 미루기",
  ])

  const emotions = [
    { emoji: "😊", label: "기쁨", value: "happy" },
    { emoji: "😐", label: "보통", value: "neutral" },
    { emoji: "😠", label: "화남", value: "angry" },
    { emoji: "😢", label: "슬픔", value: "sad" },
    { emoji: "😰", label: "불안", value: "anxious" },
    { emoji: "😴", label: "피곤", value: "tired" },
  ]

  const personalGoals = [
    {
      title: "업무 중 약물 투여 기억하기",
      description: "간호사 업무 중 환자 약물 투여를 빠뜨리지 않기",
      baseline: "주 3-4회 실수 → 목표: 주 1회 이하",
    },
    {
      title: "필요한 물품 한 번에 챙기기",
      description: "라운딩 시 필요한 물품을 미리 체크하여 왕복 줄이기",
      baseline: "매번 2-3번 왕복 → 목표: 1번에 완료",
    },
    {
      title: "전체적인 업무 파악하기",
      description: "한 가지에만 집중하지 말고 전체 업무 상황 고려하기",
      baseline: "하나만 보고 나머지 놓침 → 목표: 전체 상황 파악",
    },
  ]

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  const handleSideEffectToggle = (effect: string) => {
    setSelectedSideEffects((prev) => (prev.includes(effect) ? prev.filter((e) => e !== effect) : [...prev, effect]))
  }

  const handleMistakeToggle = (mistake: string) => {
    setSelectedMistakes((prev) => (prev.includes(mistake) ? prev.filter((m) => m !== mistake) : [...prev, mistake]))
  }

  const addCustomMistake = () => {
    if (customMistake.trim()) {
      if (!mistakeTags.includes(customMistake.trim())) {
        setMistakeTags(prev => [...prev, customMistake.trim()])
      }
      handleMistakeToggle(customMistake.trim())
      setCustomMistake("")
    }
  }

  const handlePersonalGoalChange = (goalIndex: number, value: number[]) => {
    setPersonalGoalScores((prev) => ({
      ...prev,
      [goalIndex]: value[0],
    }))
  }

  const addCustomSideEffect = () => {
    if (customSideEffect.trim()) {
      if (!sideEffects.includes(customSideEffect.trim())) {
        setSideEffects(prev => [...prev, customSideEffect.trim()])
      }
      handleSideEffectToggle(customSideEffect.trim())
      setCustomSideEffect("")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <CardTitle className="text-xl">일지 작성</CardTitle>
          </div>
          <CardDescription className="text-gray-600">오늘의 상태와 약물 효과를 기록해보세요</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                날짜
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="medication"
                checked={medicationTaken}
                onCheckedChange={(checked) => setMedicationTaken(checked as boolean)}
              />
              <Label htmlFor="medication" className="flex items-center gap-2 text-sm font-medium">
                <Pill className="w-4 h-4" />
                약물 복용
              </Label>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">수면 시간: {sleepHours[0]}시간</Label>
              <Slider value={sleepHours} onValueChange={setSleepHours} max={12} min={3} step={0.5} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* 감정 상태 */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5" />
              감정 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {emotions.map((emotion) => (
                <Button
                  key={emotion.value}
                  variant={selectedEmotions.includes(emotion.value) ? "default" : "outline"}
                  className="h-20 flex flex-col gap-2 p-3"
                  onClick={() => handleEmotionToggle(emotion.value)}
                >
                  <span className="text-2xl">{emotion.emoji}</span>
                  <span className="text-xs">{emotion.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 부작용 기록 */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            부작용 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            {sideEffects.map((effect) => (
              <div key={effect} className="flex items-center space-x-2">
                <Checkbox
                  id={effect}
                  checked={selectedSideEffects.includes(effect)}
                  onCheckedChange={() => handleSideEffectToggle(effect)}
                />
                <Label htmlFor={effect} className="text-sm">
                  {effect}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="새로운 부작용 추가..."
              value={customSideEffect}
              onChange={(e) => setCustomSideEffect(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addCustomSideEffect()
                }
              }}
            />
            <Button
              size="sm"
              onClick={addCustomSideEffect}
            >
              추가
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 오늘 나는 어땠을까? */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            오늘 나는 어땠을까?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 업무적 실수/불편 사항 */}
          <div>
            <h4 className="font-medium mb-3 text-red-700">업무적 실수/불편 사항</h4>
            <p className="text-sm text-gray-600 mb-4">오늘 발생한 실수나 불편했던 점을 선택하거나 추가해주세요</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {mistakeTags.map((mistake) => (
                <Button
                  key={mistake}
                  variant={selectedMistakes.includes(mistake) ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleMistakeToggle(mistake)}
                  className="text-xs"
                >
                  {selectedMistakes.includes(mistake) ? "- " : "+ "}
                  {mistake}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="새로운 실수/불편사항 추가..."
                value={customMistake}
                onChange={(e) => setCustomMistake(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addCustomMistake()
                  }
                }}
              />
              <Button size="sm" onClick={addCustomMistake}>
                추가
              </Button>
            </div>
          </div>

          {/* 개인 치료 목표 달성도 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700 font-semibold">개인 치료 목표 달성도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalGoals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-blue-50">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-blue-900 mb-1">{goal.title}</h5>
                        <p className="text-sm text-blue-700 mb-1">{goal.description}</p>
                        <p className="text-xs text-blue-600">{goal.baseline}</p>
                      </div>
                      <div className="flex flex-col items-center min-w-[120px] ml-4">
                        <span className="text-blue-900 font-semibold text-sm mb-1">{personalGoalScores[index] || 0}/10</span>
                        <Slider
                          value={[personalGoalScores[index] || 0]}
                          onValueChange={(value) => handlePersonalGoalChange(index, value)}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full max-w-[120px] mt-2 mb-2"
                          style={{ transform: "none" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 추가 메모 */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle>추가 메모</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="약물 효과에 대한 구체적인 경험을 자유롭게 기록해주세요.

예시:
- 오전에는 집중이 잘 됐는데 오후 3시쯤부터 효과가 떨어지는 느낌
- 평소보다 차분하게 대화할 수 있었음
- 업무 실수가 현저히 줄었음
- 충동적으로 뭔가 사고 싶은 마음이 덜했음"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-center pb-8">
        <Button size="lg" className="px-12 py-3 bg-black text-white hover:bg-gray-800">
          일지 저장
        </Button>
      </div>
    </div>
  )
}
