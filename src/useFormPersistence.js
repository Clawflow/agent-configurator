import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'aik-agent-configurator-form'
const STEP_KEY = 'aik-agent-configurator-step'

export function useFormPersistence(initialForm, initialStep = 0) {
  // Initialize state from localStorage or defaults
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Merge with initial to ensure all keys exist
        return { ...initialForm, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to restore form data:', e)
    }
    return initialForm
  })

  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem(STEP_KEY)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) return parsed
      }
    } catch (e) {
      console.warn('Failed to restore step:', e)
    }
    return initialStep
  })

  // Persist form data on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch (e) {
      console.warn('Failed to save form data:', e)
    }
  }, [form])

  // Persist step on change
  useEffect(() => {
    try {
      localStorage.setItem(STEP_KEY, String(step))
    } catch (e) {
      console.warn('Failed to save step:', e)
    }
  }, [step])

  const update = useCallback((field, value) => {
    setForm(f => ({ ...f, [field]: value }))
  }, [])

  const clearPersistence = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STEP_KEY)
    } catch (e) {
      console.warn('Failed to clear persistence:', e)
    }
  }, [])

  // Save submission to localStorage as backup
  const saveSubmission = useCallback((formData) => {
    try {
      const submissions = JSON.parse(localStorage.getItem('aik-submissions') || '[]')
      submissions.push({
        ...formData,
        submittedAt: new Date().toISOString(),
        id: crypto.randomUUID?.() || Date.now().toString(36),
      })
      localStorage.setItem('aik-submissions', JSON.stringify(submissions))
    } catch (e) {
      console.warn('Failed to save submission backup:', e)
    }
  }, [])

  return { form, setForm, step, setStep, update, clearPersistence, saveSubmission }
}
