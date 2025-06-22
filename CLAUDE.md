# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 web application that provides various utility tools for data engineers and developers. The project is deployed at https://meggie.be/ and contains utilities for common tasks like Base64 encoding/decoding, JSON formatting, timestamp conversion, QR code generation, and BigQuery to PySpark schema conversion.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static site

## Architecture & Structure

### Core Architecture
- **Framework**: Nuxt 3 with Vue 3 composition API
- **Styling**: Tailwind CSS
- **Icons**: Nuxt Icon with MDI icon set
- **Structure**: Pages-based routing with utilities under `/utils/`

### Key Components
- `composables/useUtilities.ts` - Central configuration for all utility tools with metadata (name, path, icon, description)
- `components/Sidebar.vue` - Navigation sidebar that dynamically renders utilities from the composable
- `pages/utils/` - Individual utility pages (base64.vue, json.vue, timestamp.vue, etc.)

### Utility System
Each utility is defined in the `useUtilities` composable with:
- Unique ID and display name  
- Icon from MDI icon set
- Route path under `/utils/`
- Description for tooltips

New utilities should be added to the composable first, then create the corresponding Vue page.

### Notable Features
- BigQuery to PySpark schema converter with comprehensive type mappings
- QR code generation using qrcode-vue3 library
- Pomodoro timer with audio notifications
- Feedback system integrated with GitHub API

### Configuration
- Google Analytics tracking configured in nuxt.config.ts
- GitHub token for feedback feature via runtime config
- Tailwind CSS and Nuxt Icon modules configured

### File Structure Patterns
- Utility pages follow naming pattern: `pages/utils/[utility-name].vue`
- All utilities use similar structure: input textarea/form, convert button, output display with copy functionality
- Consistent styling with Tailwind classes for forms, buttons, and result displays