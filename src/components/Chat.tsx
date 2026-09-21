import React from 'react'
import clsx from 'clsx'

import type { StartFormDataT } from './StartForm'
import type { ExpandR } from '../utils/types'
import ApiFetch from '../utils/api'

export type ChatCredT = StartFormDataT

type MsgT = {
  text: string
  fromMe: boolean
  error?: boolean
}

type ApiReceiveRespT = {
  receiptId?: number
  body?: {
    messageData?: {
      textMessageData?: {
        textMessage: string
      }
    }
    senderData?: {
      senderPhoneNumber?: number
    }
  }
}

export default React.memo(function Chat(props: { cred: ExpandR<ChatCredT>; backHandler: () => void }) {
  const { cred } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_upd, setUpd] = React.useState(0)
  const justUpd = () => setUpd((prev) => prev + 1)

  const inpTextRef = React.useRef<HTMLInputElement>(null)
  const msgs = React.useRef<Array<MsgT>>([])
  const gotIncoming = React.useRef(new Set<number>())
  const domcnt = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const msgsdom = domcnt.current!.querySelector<HTMLDivElement>('.msgs')
    if (msgsdom) {
      msgsdom.scrollTo({
        top: msgsdom.scrollHeight,
        left: 0,
        behavior: 'smooth',
      })
      // const lastmsg = msgsdom.lastElementChild
      // if (lastmsg) lastmsg.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  })

  React.useEffect(() => {
    let raf = 0
    let lastUpdT = 0
    const updDelayMs = 1000 * 10

    let wasgeterror = false

    const tick = (): void => {
      const t = Date.now()
      if (t - lastUpdT > updDelayMs) {
        ApiFetch(cred.id, cred.token, 'receiveNotification')
          .then((response) => response.json())
          .then((json) => {
            const resp = json as ApiReceiveRespT
            if (resp && resp.receiptId) {
              const receiptId = resp.receiptId

              if (!gotIncoming.current.has(receiptId)) {
                gotIncoming.current.add(receiptId)

                ApiFetch(cred.id, cred.token, 'deleteNotification', undefined, 'DELETE', receiptId)

                const msgTxt = resp.body?.messageData?.textMessageData?.textMessage
                // const msgSenderPhone = String(resp.body?.senderData?.senderPhoneNumber)
                // msgSenderPhone === cred.phone
                if (msgTxt) {
                  msgs.current.push({ text: msgTxt, fromMe: false })
                  justUpd()
                }
              }
            }
          })
          .catch((e: Error) => {
            console.log(e)
            if (!wasgeterror) {
              wasgeterror = true

              msgs.current.push({
                text: 'Ошибка при попытке получить сообщения с сервера!',
                fromMe: false,
                error: true,
              })

              justUpd()
            }
          })
        lastUpdT = t
      }
      raf = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      console.log('cancelAnimationFrame')
    }
  }, [cred])

  const send = React.useCallback(() => {
    const inp = inpTextRef.current
    if (inp) {
      const message = inp.value
      if (message) {
        inp.value = ''

        let msgId = ''
        const reqBody = { chatId: `${cred.phone}@c.us`, message }

        ApiFetch(cred.id, cred.token, 'sendMessage', reqBody, 'POST')
          .then((response) => response.json())
          .then((json) => {
            if (json && json.idMessage) msgId = json.idMessage as string
          })
          .catch((e: Error) => console.log(e))
          .finally(() => {
            msgs.current.push({ text: message, fromMe: true, error: !msgId })
            justUpd()
          })
      }
    }
  }, [cred])

  return (
    <div className="chat" ref={domcnt}>
      <div className="head">
        <div className="btn uiel back" onClick={props.backHandler}>
          Назад
        </div>
      </div>
      <div className="msgs">
        {msgs.current.map((e, index) => {
          const cls = clsx(e.fromMe && 'from-me', e.error && 'error')
          return (
            <p className={cls} key={index}>
              {e.text}
            </p>
          )
        })}
      </div>
      <div className="msgform">
        <input className="uiel" type="text" placeholder="Текст сообщения" ref={inpTextRef} />
        <div className="btn uiel" onClick={send}>
          Отправить
        </div>
      </div>
    </div>
  )
})
