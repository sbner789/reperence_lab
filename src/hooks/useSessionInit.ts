import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const useSessionInit = () => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
      } catch {
        // 리프레시 토큰 없거나 만료 → 비로그인 상태 유지
      } finally {
        setIsReady(true);
      }
    };

    restoreSession();
  }, [setAccessToken]);

  return { isReady };
};

export default useSessionInit;
