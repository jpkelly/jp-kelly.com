import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'JP Kelly CMS',
  projectId: 'tl4n7qut',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
