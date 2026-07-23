import { action } from 'mobx'

interface MobxFormItem<T> {
  value: T
  error: string

  change: (value: T) => void

}

export type MobxForm<T> = Partial<{
  [P in keyof T]: MobxFormItem<T[P]>
} & {
  setErrors: (errors: Partial<T>) => void
  getErrors: () => Partial<T>
  setData: (data: Partial<T>) => void
  getData: () => Partial<T>
} & T>

export function createForm<T extends {}> (form: MobxForm<T>, fields: T): void {
  // console.log('form', form)
  // console.log('fields', fields)
  Object.keys(fields).forEach(prop => {
    form[prop] = {
      value: fields[prop],
      error: '',
      change: action((value: T): void => {
        // console.log('change', form, prop)
        if (form[prop]) form[prop].value = value
      })
    }

    // @ts-ignore
    form.setErrors = action((errors: Partial<T>): void => {
      Object.keys(form).forEach(prop => {
        if (form[prop].error) form[prop].error = ''
      })

      Object.keys(errors).forEach(prop => {
        if (form[prop]) form[prop].error = errors[prop]

        if (form[prop].error === 'Email is required') form[prop].error = 'Введите адрес email'
        if (form[prop].error === 'Email is invalid') form[prop].error = 'Неврный формат email'
        if (form[prop].error === 'Email not found') form[prop].error = 'Такой email не зарегистрирован'
        if (form[prop].error === 'Email is already in use') form[prop].error = 'Пользователь с таким email уже зарегистрирован'
        if (form[prop].error === 'No user found with such email') form[prop].error = 'Нет пользователя с таким адресом email'
        if (form[prop].error === 'Password is required') form[prop].error = 'Введите пароль'
        if (form[prop].error === 'Password is invalid') form[prop].error = 'Неверный пароль'
        if (form[prop].error === 'old_password is required') form[prop].error = 'Введите ваш текущий пароль'
        if (form[prop].error === 'new_password is required') form[prop].error = 'Введите новый пароль'
        if (form[prop].error === 'Promo code is incorrect') form[prop].error = 'Промо-код недействителен'
      })
    })

    // @ts-ignore
    form.getErrors = action((): Partial<T> => {
      const errors = {}
      Object.keys(form).forEach(prop => {
        if (form[prop].error) errors[prop] = form[prop].error
      })

      return errors
    })

    // @ts-ignore
    form.setData = action((data: Partial<T>): void => {
      Object.keys(data).forEach(prop => {
        if (form[prop]) {
          form[prop].value = data[prop]
          form[prop].error = ''
        }
      })
    })

    // @ts-ignore
    form.getData = action((): Partial<T> => {
      const data = {}
      Object.keys(form).forEach(prop => {
        if (form[prop].value) data[prop] = form[prop].value
      })

      return data
    })
    // console.log(prop)
  })
}
