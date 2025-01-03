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
        id: 'json',
        name: 'JSON Tools',
        path: '/utils/json',
        icon: 'mdi:code-json',
        description: 'JSON validation, formatting and JSONPath evaluation'
      },
      {
        id: 'colors',
        name: 'Color Palette',
        path: '/utils/colors',
        icon: 'mdi:palette',
        description: 'Generate color palettes'
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
      {
        id: 'coin',
        name: 'Coin Flip',
        path: '/utils/coin',
        icon: 'mdi:coin',
        description: 'Simulate coin flips'
      },
      {
        id: 'dice',
        name: 'Dice Roller',
        path: '/utils/dice',
        icon: 'mdi:dice-multiple',
        description: 'Roll various types of dice'
      },
      {
        id: 'password',
        name: 'Password Generator',
        path: '/utils/password',
        icon: 'mdi:form-textbox-password',
        description: 'Generate secure passwords'
      },
      {
        id: 'image',
        name: 'AI Image Generator',
        path: '/utils/image',
        icon: 'mdi:image',
        description: 'Generate images using AI'
      }
    ]
  
    return {
      utilities
    }
  }