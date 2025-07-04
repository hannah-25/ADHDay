import axios from 'axios';

// API 기본 URL - 외부 백엔드 서버 사용
const API_BASE_URL = 'http://localhost:8080/api';

// Axios 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 로그인 API
export const login = (email: string, password: string) => {
  return apiClient.post('/auth/login', { email, password });
};

// 회원가입 API
export const register = (email: string, password: string) => {
  // 여러 가능한 엔드포인트 시도
  return apiClient.post('/auth/signup', { email, password });
};

// 로그아웃 API
export const logout = () => {
  const token = localStorage.getItem('authToken');
  return apiClient.post('/auth/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

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

// 사용자 정보 가져오기 API
export const getUserInfo = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return Promise.reject(new Error('토큰이 없습니다'));
  }
  
  // JWT에서 사용자 정보 추출
  const decoded = decodeJWT(token);
  console.log('API에서 JWT 디코드 결과:', decoded);
  if (decoded) {
    const userInfo = {
      id: decoded.id,
      email: decoded.sub || decoded.email,
      name: decoded.name || (decoded.sub ? decoded.sub.split('@')[0] : '사용자')
    };
    console.log('API에서 추출한 사용자 정보:', userInfo);
    return Promise.resolve({
      data: {
        user: userInfo
      }
    });
  }
  
  // JWT에서 정보를 추출할 수 없으면 서버에 요청
  return apiClient.get('/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// 요청 인터셉터 - 요청 로깅
apiClient.interceptors.request.use(
  (config) => {
    console.log('API 요청:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 모든 API 응답에 대한 공통 처리
apiClient.interceptors.response.use(
  (response) => {
    console.log('API 응답 성공:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.log('API 응답 에러:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        method: error.config?.method,
        url: error.config?.url,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export default apiClient; 