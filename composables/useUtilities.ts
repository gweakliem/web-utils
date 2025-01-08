// composables/useUtilities.ts
export const useUtilities = () => {
    const utilities = [
      {
        id: 'base64',
        name: 'Base64 Encoder/Decoder',
        path: '/utils/base64',
        icon: 'mdi:code-brackets',
        description: 'Encode or decode Base64 strings'
      },
      {
        id: 'urlencode',
        name: 'URL Encoder',
        path: '/utils/urlencode',
        icon: 'mdi:percent',
        description: 'Encode and decode URL components'
      },
      {
        id: 'json',
        name: 'JSON Tools',
        path: '/utils/json',
        icon: 'mdi:code-json',
        description: 'JSON validation, formatting and JSONPath evaluation'
      },
      {
        id: 'pomodoro',
        name: 'Pomodoro Timer',
        path: '/utils/pomodoro',
        icon: 'mdi:timer',
        description: 'Pomodoro technique timer'
      },
      {
        id: 'qr',
        name: 'QR Generator',
        path: '/utils/qr',
        icon: 'mdi:qrcode',
        description: 'Generate QR codes from URLs'
      },
      // {
      //   id: 'dice',
      //   name: 'Dice Roller',
      //   path: '/utils/dice',
      //   icon: 'mdi:dice',
      //   description: 'Roll various types of dice'
      // },
      // {
      //   id: 'password',
      //   name: 'Password Generator',
      //   path: '/utils/password',
      //   icon: 'mdi:form-textbox-password',
      //   description: 'Generate secure passwords'
      // },
      // {
      //   id: 'rng',
      //   name: 'Random Number Generator',
      //   path: '/utils/rng',
      //   icon: 'mdi:numeric',
      //   description: 'Generate random numbers'
      // },
      {
        id: 'schema',
        name: 'Schema Tools',
        path: '/utils/schema',
        icon: 'mdi:file-tree',
        description: 'JSON Schema validation and tools'
      },
      {
        id: 'feedback',
        name: 'Feedback',
        path: '/utils/feedback',
        icon: 'mdi:message-text',
        description: 'Feedback or report issues'
      }
    ]
  
    return {
      utilities
    }
  }