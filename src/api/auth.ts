import { DEMO_LOGIN, DEMO_PASSWORD, DEMO_USER_ID } from '@/config/demo'

export function loginRequest(login: string, password: string) {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (login === DEMO_LOGIN && password === DEMO_PASSWORD) {
        resolve(DEMO_USER_ID)
      } else {
        reject(new Error('Неверный логин или пароль'))
      }
    }, 600)
  })
}
