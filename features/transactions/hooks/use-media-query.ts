'use client'
import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const updateMatches = () => {
      if (media.matches !== matches) {
        setMatches(media.matches)
      }
    }
    
    // ✅ Initial check
    updateMatches()

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [query]) 

  return matches
}