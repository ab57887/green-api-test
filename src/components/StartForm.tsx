import React from 'react'
import clsx from 'clsx'

export type StartFormDataT = {
  id: string
  token: string
  phone: string
}

export default function StartFormDataT(props: {
  handler: (e: StartFormDataT) => void
  initInput?: StartFormDataT | null
}) {
  const { handler, initInput } = props

  const [inpIdError, setInpIdError] = React.useState('')
  const [inpTokenError, setInpTokenError] = React.useState('')
  const [inpPhoneError, setInpPhoneError] = React.useState('')

  const inpIdRef = React.useRef<HTMLInputElement>(null)
  const inpTokenRef = React.useRef<HTMLInputElement>(null)
  const inpPhoneRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const idInp = inpIdRef.current
    const tokenInp = inpTokenRef.current
    const phoneInp = inpPhoneRef.current

    if (idInp && tokenInp && phoneInp) {
      if (initInput) {
        idInp.value = initInput.id
        tokenInp.value = initInput.token
        phoneInp.value = initInput.phone
      }
      const idInpHandler = () => {
        const vs = idInp.value.split(/\s+/)
        if (vs.length === 3) {
          idInp.value = vs[0]
          tokenInp.value = vs[1]
          phoneInp.value = vs[2]
        }
        setInpIdError('')
      }
      const tokenInpHandler = () => setInpTokenError('')
      const phoneInpHandler = () => setInpPhoneError('')

      idInp.addEventListener('input', idInpHandler)
      tokenInp.addEventListener('input', tokenInpHandler)
      phoneInp.addEventListener('input', phoneInpHandler)
      return () => {
        idInp.removeEventListener('input', idInpHandler)
        tokenInp.removeEventListener('input', tokenInpHandler)
        phoneInp.removeEventListener('input', phoneInpHandler)
      }
    }
  }, [])

  const btnClicl = React.useCallback(() => {
    const idInp = inpIdRef.current
    const tokenInp = inpTokenRef.current
    const phoneInp = inpPhoneRef.current

    if (idInp && tokenInp && phoneInp) {
      const id = idInp.value
      const token = tokenInp.value
      const phone = phoneInp.value
      setInpIdError(id ? '' : 'Введите idInstance')
      setInpTokenError(token ? '' : 'Введите apiTokenInstance')
      setInpPhoneError(phone ? '' : 'Введите номер телефона')
      if (id && token && phone) {
        handler({ id, token, phone })
      }
    }
  }, [])

  return (
    <div className="startform">
      <b>Используется green-api.com</b>
      <input
        className={clsx('uiel', inpIdError && 'error')}
        type="text"
        placeholder="Введите idInstance"
        ref={inpIdRef}
      />
      <input
        className={clsx('uiel', inpTokenError && 'error')}
        type="text"
        placeholder="Введите apiTokenInstance"
        ref={inpTokenRef}
      />
      <input
        className={clsx('uiel', inpPhoneError && 'error')}
        type="text"
        placeholder="Введите номер собеседника (79200123456)"
        ref={inpPhoneRef}
      />
      <div className="btn uiel" onClick={btnClicl}>
        Вперёд
      </div>
    </div>
  )
}
