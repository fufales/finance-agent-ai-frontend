import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWA() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log('SW Registered: ' + r)
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    setOfflineReady,
    setNeedRefresh
  }
}
