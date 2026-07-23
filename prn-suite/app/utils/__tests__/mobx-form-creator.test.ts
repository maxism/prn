import {createForm, MobxForm} from '../mobx-form-creator'

interface IForm {
  name: string
  email: number,
  password: string
}

class A {
  public testForm: MobxForm<IForm> = {}

  constructor() {
    createForm<IForm>(this.testForm, {
      name: '',
      email: 2,
      password: ''
    })
  }
}

describe('mobx-form-creator', () => {
  it('Проверка создания формы', async () => {
    const a = new A()

    a.testForm.name.change('test')
    a.testForm.email.change(3)
    a.testForm.setErrors({
      name: 'Error',
      password: 'Error'
    })
    a.testForm.setErrors({
      password: 'Error'
    })

    expect(a.testForm.name.value).toEqual('test')
    expect(a.testForm.name.error).toEqual('')
    expect(a.testForm.email.value).toEqual(3)
    expect(a.testForm.password.error).toEqual('Error')

    a.testForm.setData({ name: '', email: 0, password: '' })

    expect(a.testForm.name.value).toEqual('')
    expect(a.testForm.name.error).toEqual('')
    expect(a.testForm.email.value).toEqual(0)
    expect(a.testForm.email.error).toEqual('')
    expect(a.testForm.password.value).toEqual('')
    expect(a.testForm.password.error).toEqual('')
  })
})
