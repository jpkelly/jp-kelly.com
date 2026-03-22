import React from 'react'
import { Studio } from 'sanity'
import { defineConfig } from 'sanity'
import config from '../sanity.config'

export default function StudioPage() {
  return <Studio config={config} />
}
