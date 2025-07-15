import axios from 'axios';
import Cookies from 'js-cookie'

// API 기본 URL - 외부 백엔드 서버 사용
const API_BASE_URL = 'http://localhost:8080/api';

// Axios 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 로그인 API
export const login = (email: string, password: string) => {
  return apiClient.post('/auth/login', { email, password }, { withCredentials: true });
};

// 회원가입 API
export const register = (email: string, password: string) => {
  // 여러 가능한 엔드포인트 시도
  return apiClient.post('/auth/signup', { email, password }, { withCredentials: true });
};

// 토큰 갱신 API
export const refreshToken = () => {
  const refreshToken = Cookies.get('refreshToken');
  return apiClient.post('/auth/refresh', { refreshToken }, { withCredentials: true });
};

// 로그아웃 API
export const logout = () => {
  const token = Cookies.get('authToken');
  return apiClient.post('/auth/logout', {}, {
    withCredentials: true,
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
  const token = Cookies.get('access_token');
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      const userInfo={id:decoded.id,email:decoded.sub||decoded.email,name:decoded.name||((decoded.sub||'').split('@')[0])}
      return Promise.resolve({data:{user:userInfo}})
    }
  }
  // fallback to server request; credentials included so cookie will be sent
  return apiClient.get('/auth/me', { withCredentials: true });
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
  return apiClient.post(`/assessments/${typeId}/answers`, {
    answers
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
      const refreshToken = Cookies.get('refreshToken');
      
      if (refreshToken) {
        error.config._retry = true;
        
        try {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken: refreshToken
          });
          
          if (response.data.accessToken) {
            Cookies.set('authToken', response.data.accessToken);
            if (response.data.refreshToken) { Cookies.set('refreshToken', response.data.refreshToken); }
            
            // 원래 요청 재시도
            error.config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return apiClient(error.config);
          }
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          // 토큰 갱신 실패 시 로그아웃 처리
          Cookies.remove('authToken');
          Cookies.remove('refreshToken');
          Cookies.remove('userInfo');
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 