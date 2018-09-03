import { Auth } from 'client/auth';
import { RemoveProps } from 'utilities/typings';

interface Options extends RemoveProps<RequestInit, 'headers'> {
  headers?: { [key: string]: string };
}

export async function fetchWithAuth(url: string, _options?: Options) {
  const token = await Auth.token();
  const options = _options || ({} as Options);

  return fetch(url, {
    ...options,
    headers: new Headers({
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    }),
  });
}
