interface NetworkRequest {
  url: string;
  config?: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers: {
      [key: string]: string;
    };
    body?: string;
  };
}

export const networkRequest = (params: NetworkRequest): Promise<unknown> =>
  new Promise((resolve, reject) => {
    try {
      fetch(params.url, params.config)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });
