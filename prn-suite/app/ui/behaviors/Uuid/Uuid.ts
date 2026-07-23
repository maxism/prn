let unicId = 0

export default function (): string {
  unicId++
  return `id${unicId}`
}
