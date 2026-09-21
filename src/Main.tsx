import React from 'react'

import StartForm, { type StartFormDataT } from './components/StartForm'
import Chat, { type ChatCredT } from './components/Chat'

export default React.memo(function Main() {
  const [chatCred, setChatCred] = React.useState<ChatCredT | null>(null)

  const store = React.useMemo(() => {
    const store = {
      startFormData: null as StartFormDataT | null,
      startFormHandler: (e: StartFormDataT) => {
        store.startFormData = e
        setChatCred(e)
      },
      backHandler: () => {
        setChatCred(null)
      },
    }
    return store
  }, [])

  let appContent: React.ReactNode = null
  if (chatCred) appContent = <Chat cred={chatCred} backHandler={store.backHandler} />
  else appContent = <StartForm handler={store.startFormHandler} initInput={store.startFormData} />

  return <div className="app">{appContent}</div>
})
