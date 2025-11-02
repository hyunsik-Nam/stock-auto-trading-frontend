interface Config {
  apiBaseUrl: string;
  websocketUrl: string;
  environment: 'development' | 'production';
  isDevelopment: boolean;
  isProduction: boolean;
}

const getConfig = (): Config => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'production';

  if (!apiBaseUrl || !websocketUrl || !environment) {
    throw new Error('필수 환경 변수가 설정되지 않았습니다.');
  }

  return {
    apiBaseUrl,
    websocketUrl,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
  };
};

export const config = getConfig();

export const getApiUrl = (endpoint: string): string => {
  return `${config.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getWebSocketUrl = (path: string = ''): string => {
  return `${config.websocketUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
