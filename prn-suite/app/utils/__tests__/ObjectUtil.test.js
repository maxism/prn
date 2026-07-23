import ObjectUtil from '../ObjectUtil'

describe('objectUtil', () => {
  it('.removeUndefined: Обработка общих полей', async () => {
    const obj = { a: 1, b: '2', c: null, d: undefined }
    expect(ObjectUtil.removeUndefined(obj)).toEqual({ a: 1, b: '2', c: null })
  })

  it('.removeUndefined: Обработка массивов', async () => {
    const obj = { a: [], b: [1, 2, 3], c: [{ a: 1, b: '2' }, { a: '7', b: null }, { a: 5, b: undefined }] }
    expect(ObjectUtil.removeUndefined(obj)).toEqual({ a: [], b: [1, 2, 3], c: [{ a: 1, b: '2' }, { a: '7', b: null }, { a: 5 }] })
  })
})
