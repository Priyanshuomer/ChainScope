import { useState, useEffect, useCallback } from 'react'
import { z } from 'zod'

// Security schemas for localStorage validation
const favoritesSchema = z.array(z.number().int().positive()).max(1000)
const recentlyViewedSchema = z.array(z.number().int().positive()).max(100)

// Maximum size for localStorage values (1MB)
const MAX_STORAGE_SIZE = 1024 * 1024

function validateStorageSize(value: string): boolean {
  return new Blob([value]).size <= MAX_STORAGE_SIZE
}

function parseWithValidation<T>(item: string, schema?: z.ZodSchema): T | null {
  try {
    const parsed = JSON.parse(item)
    if (schema) {
      const result = schema.safeParse(parsed)
      return result.success ? (result.data as T) : null
    }
    return parsed as T
  } catch {
    return null
  }
}

export function useLocalStorage<T>(key: string, initialValue: T, schema?: z.ZodSchema) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      
      if (!validateStorageSize(item)) {
        console.warn(`localStorage item "${key}" exceeds size limit`)
        return initialValue
      }
      
      const parsed = parseWithValidation<T>(item, schema)
      return parsed !== null ? parsed : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prevValue => {
        const valueToStore = value instanceof Function ? value(prevValue) : value
        const serialized = JSON.stringify(valueToStore)
        
        // Validate size before storing
        if (!validateStorageSize(serialized)) {
          console.error(`Cannot store localStorage key "${key}": exceeds size limit`)
          return prevValue
        }
        
        // Validate with schema if provided
        if (schema && !schema.safeParse(valueToStore).success) {
          console.error(`Cannot store localStorage key "${key}": validation failed`)
          return prevValue
        }
        
        window.localStorage.setItem(key, serialized)
        return valueToStore
      })
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, schema])

  return [storedValue, setValue] as const
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<number[]>('chainlist-favorites', [], favoritesSchema)
  
  const addToFavorites = useCallback((chainId: number, requireWallet = false) => {
    if (requireWallet) {
      // This will be handled by the component that calls this function
      // The component should check wallet connection before calling this
      return false
    }
    setFavorites(prev => [...prev, chainId])
    return true
  }, [setFavorites])
  
  const removeFromFavorites = useCallback((chainId: number) => {
    setFavorites(prev => prev.filter(id => id !== chainId))
  }, [setFavorites])
  
  const isFavorite = useCallback((chainId: number) => {
    return favorites.includes(chainId)
  }, [favorites])
  
  return { favorites, addToFavorites, removeFromFavorites, isFavorite }
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<number[]>('chainlist-recent', [], recentlyViewedSchema)
  
  const addToRecentlyViewed = useCallback((chainId: number) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== chainId)
      return [chainId, ...filtered].slice(0, 10) // Keep only last 10
    })
  }, [setRecentlyViewed])
  
  return { recentlyViewed, addToRecentlyViewed }
}