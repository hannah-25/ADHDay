"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface SocialLoginButtonsProps {
  type: "login" | "signup"
}

export default function SocialLoginButtons({ type }: SocialLoginButtonsProps) {
  const buttonText = type === "login" ? "로그인" : "회원가입"

  const handleGoogleAuth = () => {
    // Google OAuth2 로직 구현
    console.log("Google auth initiated")
    // window.location.href = "/api/auth/google"
  }

  const handleKakaoAuth = () => {
    // Kakao OAuth2 로직 구현
    console.log("Kakao auth initiated")
    // window.location.href = "/api/auth/kakao"
  }

  const handleNaverAuth = () => {
    // Naver OAuth2 로직 구현
    console.log("Naver auth initiated")
    // window.location.href = "/api/auth/naver"
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Google 로그인 */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 border-gray-300 hover:bg-gray-50 bg-transparent"
        onClick={handleGoogleAuth}
      >
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-xs text-gray-700">Google</span>
        </div>
      </Button>

      {/* Kakao 로그인 */}
      <Button
        type="button"
        size="sm"
        className="h-10 bg-[#FEE500] hover:bg-[#FDD835] text-black border-0"
        onClick={handleKakaoAuth}
      >
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
          </svg>
          <span className="text-xs">카카오</span>
        </div>
      </Button>

      {/* Naver 로그인 */}
      <Button
        type="button"
        size="sm"
        className="h-10 bg-[#03C75A] hover:bg-[#02B351] text-white border-0"
        onClick={handleNaverAuth}
      >
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
          </svg>
          <span className="text-xs">네이버</span>
        </div>
      </Button>
    </div>
  )
}
