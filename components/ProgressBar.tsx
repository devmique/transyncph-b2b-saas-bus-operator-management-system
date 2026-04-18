'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

const style = `
  #nprogress .bar {
    background: #2563eb !important;
    height: 2px !important;
  }
`

export default function ProgressBar() {
  const pathname = usePathname()

  useEffect(() => {
    NProgress.done()
    return () => { NProgress.start() }
  }, [pathname])

  return <style>{style}</style>
}