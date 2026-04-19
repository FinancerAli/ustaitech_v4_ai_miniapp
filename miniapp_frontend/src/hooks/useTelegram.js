/**
 * Telegram WebApp SDK hook
 * Safely wraps window.Telegram.WebApp for use in React components
 */
import { useEffect, useMemo } from 'react'

export function useTelegram() {
  const tg = useMemo(() => window.Telegram?.WebApp, [])

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
      // Set header color to match our design
      tg.setHeaderColor('#10141a')
      tg.setBackgroundColor('#10141a')
    }
  }, [tg])

  const user = tg?.initDataUnsafe?.user || null
  const initData = tg?.initData || ''
  const themeParams = tg?.themeParams || {}
  const colorScheme = tg?.colorScheme || 'dark'

  const showBackButton = (show) => {
    if (tg?.BackButton) {
      show ? tg.BackButton.show() : tg.BackButton.hide()
    }
  }

  const onBackButtonClick = (callback) => {
    if (tg?.BackButton) {
      tg.BackButton.onClick(callback)
      return () => tg.BackButton.offClick(callback)
    }
    return () => {}
  }

  const showMainButton = (text, callback) => {
    if (tg?.MainButton) {
      tg.MainButton.setText(text)
      tg.MainButton.show()
      tg.MainButton.onClick(callback)
      return () => {
        tg.MainButton.offClick(callback)
        tg.MainButton.hide()
      }
    }
    return () => {}
  }

  const hapticFeedback = (type = 'light') => {
    tg?.HapticFeedback?.impactOccurred(type)
  }

  const closeMiniApp = () => {
    tg?.close()
  }

  const openTelegramLink = (url) => {
    tg?.openTelegramLink(url)
  }

  return {
    tg,
    user,
    initData,
    themeParams,
    colorScheme,
    showBackButton,
    onBackButtonClick,
    showMainButton,
    hapticFeedback,
    closeMiniApp,
    openTelegramLink,
    isInTelegram: !!tg?.initData,
  }
}
