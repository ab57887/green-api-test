import { createRoot } from 'react-dom/client'

import Main from './Main'

const root = createRoot(document.querySelector<HTMLDivElement>('.main')!)
// eslint-disable-next-line react/react-in-jsx-scope
root.render(<Main />)
