import type { User } from '@/types'

export function plural(count: number, forms: [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export function firstName(user?: User) {
  return user ? user.name.split(' ')[0] : ''
}

export function byGender(user: User | undefined, male: string, female: string) {
  return user?.gender === 'female' ? female : male
}
