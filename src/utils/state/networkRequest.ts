interface NetworkRequest {
  url: string;
}

export const networkRequest = (params: NetworkRequest): Promise<unknown> =>
  new Promise((resolve, reject) => {
    try {
      fetch(params.url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });
