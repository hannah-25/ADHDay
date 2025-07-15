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
import { login, register } from "@/lib/api"
import Cookies from 'js-cookie'

export default function LoginPage() {
  // 폼 상태 관리
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // 비밀번호 표시/숨김 토글
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태
  const router = useRouter() // 페이지 이동을 위한 router

  // 이메일 로그인 처리 함수
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await login(email, password)
      console.log('로그인 성공:', response.data)
      console.log('응답 전체 구조:', response)
      
      if (response.data.token) {
        // 기존 사용자 정보 삭제
        localStorage.removeItem('userInfo')
        Cookies.set('authToken', response.data.token)
        console.log('토큰 저장됨:', response.data.token)
      }
      
      if (response.data.refreshToken) { Cookies.set('refreshToken', response.data.refreshToken) }
      
      // JWT 토큰에서 사용자 정보 추출
      const decodeJWT = (token: string) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload);
        } catch (error) {
          console.error('JWT 디코드 실패:', error);
          return null;
        }
      };

      // 사용자 정보 저장 - JWT에서 추출
      let userInfo = null
      if (response.data.user) {
        userInfo = response.data.user
      } else if (response.data.data && response.data.data.user) {
        userInfo = response.data.data.user
      } else if (response.data) {
        // 응답 자체가 사용자 정보인 경우
        userInfo = response.data
      }
      
      // JWT에서 사용자 정보 추출 시도
      if (response.data.token) {
        const decoded = decodeJWT(response.data.token)
        console.log('JWT 디코드 결과:', decoded)
        if (decoded) {
          userInfo = {
            id: decoded.id,
            email: decoded.sub || decoded.email,
            name: decoded.name || (decoded.sub ? decoded.sub.split('@')[0] : '사용자')
          }
          console.log('JWT에서 추출한 사용자 정보:', userInfo)
        }
      }
      
      if (userInfo) {
        const userData = {
          name: userInfo.name || (userInfo.email ? userInfo.email.split('@')[0] : '사용자'),
          email: userInfo.email || '',
          avatar: userInfo.avatar || "/placeholder-user.jpg"
        }
        localStorage.setItem('userInfo', JSON.stringify(userData))
        console.log('사용자 정보 저장됨:', userData)
      } else {
        console.log('사용자 정보를 찾을 수 없음. 응답 구조:', response.data)
      }
      
      alert('로그인에 성공했습니다!')
      router.push('/')
    } catch (error: any) {
      console.error('로그인 실패:', error)
      const errorMessage = error.response?.data?.error || '로그인에 실패했습니다.'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 페이지로 이동하는 함수
  const handleSignupRedirect = () => {
    router.push('/auth/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">ADHDay</h1>
          </div>
          <p className="text-gray-600">ADHD 관리의 새로운 시작</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">로그인</CardTitle>
            <CardDescription className="text-center">계정에 로그인하여 일지를 관리하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 이메일 로그인 폼 */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인"}
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

            {/* 소셜 로그인 버튼들 */}
            <SocialLoginButtons type="login" />

            <div className="text-center text-sm">
              <span className="text-gray-600">계정이 없으신가요? </span>
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">
                회원가입
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          로그인하시면{" "}
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
