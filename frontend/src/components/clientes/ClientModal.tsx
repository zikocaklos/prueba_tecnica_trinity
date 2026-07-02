"use client"

import React from 'react'
import { Modal } from '../ui/Modal'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ClientModal({ open, onClose, title, children }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {children}
    </Modal>
  )
}
