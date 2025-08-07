"use client"

import React, { useEffect, useState } from 'react'
import { typeset } from '@/lib/initMathJax'
import { cn } from '@/lib/utils'

export interface MathContentProps {
  /** The full text content, including $...$ or $$...$$ LaTeX segments */
  content: string
  /** Optional container className */
  className?: string
}

export function MathContent({ content, className = '' }: MathContentProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    if (!content) {
      setHtml('')
      return
    }

    const segments: Array<{ type: 'text' | 'math'; content: string; display?: boolean }> = []
    let lastIndex = 0
    const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(content)) !== null) {
      const index = match.index
      if (lastIndex < index) {
        segments.push({ type: 'text', content: content.slice(lastIndex, index) })
      }
      if (match[1] !== undefined) {
        segments.push({ type: 'math', content: match[1], display: true })
      } else {
        segments.push({ type: 'math', content: match[2], display: false })
      }
      lastIndex = regex.lastIndex
    }
    if (lastIndex < content.length) {
      segments.push({ type: 'text', content: content.slice(lastIndex) })
    }

    Promise.all(
      segments.map(seg => {
        if (seg.type === 'text') {
          return Promise.resolve(
            seg.content
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\n/g, '<br>')
          )
        }
        return typeset(seg.content, Boolean(seg.display)).then(rendered => {
          // Inline math should stay inline
          if (!seg.display) {
            return `<span style="display:inline-block; vertical-align:middle;">${rendered}</span>`
          }
          return rendered
        })
      })
    )
      .then(parts => setHtml(parts.join('')))
      .catch(err => console.error('[MathContent] error rendering:', err))
  }, [content])

  return (
    <div
      className={cn("whitespace-pre-wrap break-words", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
} 