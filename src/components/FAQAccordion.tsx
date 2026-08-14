'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQ {
  q: string
  a: string
}

interface FAQAccordionProps {
  faqs: FAQ[]
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-text-primary hover:text-primary transition-colors"
          >
            <span className="font-medium">{faq.q}</span>
            <ChevronDown
              className={`w-5 h-5 flex-shrink-0 ml-4 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openIndex === index && (
            <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
