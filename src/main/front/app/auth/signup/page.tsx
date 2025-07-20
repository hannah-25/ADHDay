"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Brain, Mail, Lock, Eye, EyeOff } from "lucide-react"
import SocialLoginButtons from "@/components/auth/social-login-buttons"
import { register } from "@/lib/api"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    if (formData.password.length < 6) {
      alert("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    setIsLoading(true)

    try {
      const response = await register(formData.email, formData.password)
      console.log('회원가입 성공:', response.data)
      
      // 회원가입 성공 시 토큰 처리
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken)
        if(response.data.refreshToken){
          localStorage.setItem('refreshToken', response.data.refreshToken)
        }
        alert('회원가입에 성공했습니다! 자동으로 로그인됩니다.')
        router.push('/')
      } else {
        alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.')
        router.push('/auth/login')
      }
    } catch (error: any) {
      console.error('회원가입 실패:', error)
      console.error('에러 상세 정보:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      
      let errorMessage = '회원가입에 실패했습니다.'
      if (error.response?.status === 403) {
        errorMessage = '접근이 거부되었습니다. 서버 설정을 확인해주세요.'
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">ADHDay</h1>
          </div>
          <p className="text-gray-600">ADHD 관리의 새로운 시작</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">회원가입</CardTitle>
            <CardDescription className="text-center">새로운 계정을 만들어 일지를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요 (최소 6자)"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "회원가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <SocialLoginButtons type="signup" />

            <div className="text-center text-sm">
              <span className="text-gray-600">이미 계정이 있으신가요? </span>
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                로그인
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          회원가입하시면{" "}
          <Link href="/terms" className="underline">
            이용약관
          </Link>{" "}
          및{" "}
          <Link href="/privacy" className="underline">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  )
}
