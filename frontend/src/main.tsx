import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {store , persistor} from './redux/store.ts'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ToasterContext from './context/ToasterContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store = {store}>
    <PersistGate loading={null} persistor={persistor}>
    <ToasterContext/>
    <App />
    </PersistGate>
  </Provider>,
)
