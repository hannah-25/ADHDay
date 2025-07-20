import axios from 'axios';

// API 기본 URL - 외부 백엔드 서버 사용
const API_BASE_URL = 'http://localhost:8080/api';

// 토큰 관리 함수들
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

const setRefreshToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
};

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

// 토큰 갱신 API
export const refreshToken = () => {
  const refreshToken = getRefreshToken();
  return apiClient.post('/auth/refresh', { refreshToken });
};

// 로그아웃 API
export const logout = () => {
  const token = getToken();
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

// 설문 템플릿 받아오기
export const getAssessmentTemplate = (typeId: number) => {
  return apiClient.get(`/assessments/templates/${typeId}`);
};

// 설문 답변 제출
export const submitAssessmentAnswers = (
  typeId: number,
  answers: { questionId: number, value: number }[]
) => {
  return apiClient.post(`/assessments/results`, {
    typeId, // typeId를 body에 포함
    answers
  });
};

// 요청 인터셉터 - 모든 요청에 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
  async (error) => {
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

    // 401 에러이고 토큰 갱신이 가능한 경우
    if (error.response?.status === 401 && !error.config._retry) {
      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        error.config._retry = true;
        
        try {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken: refreshToken
          });
          
          if (response.data.accessToken) {
            setToken(response.data.accessToken);
            if (response.data.refreshToken) { 
              setRefreshToken(response.data.refreshToken); 
            }
            
            // 원래 요청 재시도
            error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return apiClient(error.config);
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          // 토큰 갱신 실패 시 로그아웃 처리
          removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 