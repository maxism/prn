let unicId = 0

export default function Uuid (): string {
  unicId++
  return `id${unicId}`
}
