# API 테스트 가이드

## 백엔드 서버 정보
- **서버 주소**: `http://localhost:8080`
- **API 기본 경로**: `/api`

## API 엔드포인트 테스트

### 1. 회원가입 테스트
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 2. 로그인 테스트
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "message": "로그인이 성공적으로 완료되었습니다.",
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. 토큰 갱신 테스트
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "message": "토큰이 갱신되었습니다.",
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 4. 로그아웃 테스트
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 프론트엔드 테스트

1. **회원가입**: `http://localhost:3000/auth/signup`
2. **로그인**: `http://localhost:3000/auth/login`
3. **메인 페이지**: `http://localhost:3000/`

## 백엔드 서버 요구사항

백엔드 서버(`localhost:8080`)에서 다음 엔드포인트들이 구현되어야 합니다:

- `POST /api/auth/register` - 회원가입 (accessToken, refreshToken 반환)
- `POST /api/auth/login` - 로그인 (accessToken, refreshToken 반환)
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

## 예상 요청/응답 형식

### 회원가입 요청
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 로그인 요청
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 로그아웃 요청
```
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
```

### 성공 응답 예시
```json
{
  "success": true,
  "message": "작업이 성공했습니다.",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "1",
      "email": "user@example.com"
    }
  }
}
``` 