import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 10px 30px rgba(0,0,0,.6)',         // ← появится класс shadow-glass
        neon: '0 0 12px rgba(240, 240, 240, 0.5)',        // ← shadow-neon (если используешь)
      },
      borderRadius: { '2xl': '1.25rem' },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [{
      'star-dark': {
        primary: '#a7a7a7ff',
        'primary-content': '#ffffff',
        accent: '#3AC1FF',
        neutral: '#232E3C',
        'base-100': '#0A0E18',
        'base-200': '#121726',
        'base-content': '#E9EEF8',
      },
    }],
    darkTheme: 'star-dark',
  },
}
