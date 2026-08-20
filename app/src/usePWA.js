import { useRegisterSW } from 'virtual:pwa-register/react'

let isUpdateCheckSetup = false;

export function usePWA() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r && !isUpdateCheckSetup) {
        isUpdateCheckSetup = true;
        console.log('SW Registered: ' + r)
        
        // Function to check for updates
        const checkForUpdate = async () => {
          try {
            console.log('Checking for SW update...');
            await r.update();
          } catch (err) {
            console.error('Error checking for SW update:', err);
          }
        };

        // Check every 1 minute
        setInterval(checkForUpdate, 60 * 1000);

        // Check on window focus and visibility change
        window.addEventListener('focus', checkForUpdate);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            checkForUpdate();
          }
        });
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
