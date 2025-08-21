import { GENRES } from "@/constant"

export const getGenre = (type: 'movies' | 'series', id: number) => {
  const target = GENRES[type].filter((item) => item.id == id)
  if (target && target[0]) return target[0].name
  return ""
}