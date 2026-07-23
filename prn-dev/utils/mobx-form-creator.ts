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
  clearData: () => void
  hydrate: (data: Partial<T>) => void
  getData: () => Partial<T>
  isCompleted: boolean
  setCompleted: () => void
  clearCompleted: () => void
} & T>

export function createForm<T extends {}> (form: MobxForm<T>, fields: T): void {
  // console.log('form', form)
  // console.log('fields', fields)
  Object.keys(fields).forEach(prop => {
    form[prop] = {
      value: fields[prop],
      error: '',
      change: action((value: T): void => {
        // console.log('change', form, prop, value)
        if (form[prop]) form[prop].value = value
      })
    }

    // @ts-ignore
    form.isCompleted = false

    // @ts-ignore
    form.setErrors = action((errors: Partial<T>): void => {
      Object.keys(form).forEach(prop => {
        if (form[prop].error) form[prop].error = ''
      })

      Object.keys(errors).forEach(prop => {
        if (form[prop]) {
          form[prop].error = errors[prop]

          if (form[prop].error === 'Email is required') form[prop].error = 'Введите адрес email'
          if (form[prop].error === 'Email is invalid') form[prop].error = 'Неверный формат email'
          if (form[prop].error === 'Email not found') form[prop].error = 'Такой email не зарегистрирован'
          if (form[prop].error === 'Email is already in use') form[prop].error = 'Пользователь с таким email уже зарегистрирован'
          if (form[prop].error === 'No user found with such email') form[prop].error = 'Нет пользователя с таким адресом email'
          if (form[prop].error === 'Password is required') form[prop].error = 'Введите пароль'
          if (form[prop].error === 'Password is invalid') form[prop].error = 'Неверный пароль'
          if (form[prop].error === 'old_password is required') form[prop].error = 'Введите ваш текущий пароль'
          if (form[prop].error === 'new_password is required') form[prop].error = 'Введите новый пароль'
          if (form[prop].error === 'Promo code is incorrect') form[prop].error = 'Промо-код недействителен'
        }
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
    form.clearData = action((): void => {
      Object.keys(form).forEach(prop => {
        if (form[prop].value) form[prop].value = ''
      })
    })

    // @ts-ignore
    form.hydrate = action((data: Partial<T>): void => {
      Object.keys(data || {}).forEach(prop => {
        if (form[prop]) {
          form[prop].value = data[prop].value
          form[prop].error = data[prop].error
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

    // @ts-ignore
    form.setCompleted = action((): void => {
      // @ts-ignore
      form.isCompleted = true

      form.setErrors({})
    })

    // @ts-ignore
    form.clearCompleted = action((): void => {
      // @ts-ignore
      form.isCompleted = false
    })
  })
}
