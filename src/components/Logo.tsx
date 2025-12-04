import Link from 'next/link'

interface LogoProps {
  variant?: 'primary' | 'secondary' | 'horizontal'
  colorScheme?: 'color' | 'white' | 'black'
  className?: string
}

export default function Logo({ 
  variant = 'primary', 
  colorScheme = 'color',
  className = '' 
}: LogoProps) {
  const bgColor = colorScheme === 'white' ? 'bg-white' : 
                  colorScheme === 'black' ? 'bg-secondary-800' : 
                  'bg-primary-600'
  
  const borderColor = colorScheme === 'white' ? 'border-white' : 
                      colorScheme === 'black' ? 'border-secondary-800' : 
                      'border-primary-600'
  
  const textColor = colorScheme === 'white' ? 'text-white' : 
                    colorScheme === 'black' ? 'text-secondary-800' : 
                    'text-secondary-800'

  // Primary Logo - Solid IWM
  if (variant === 'primary') {
    return (
      <Link href="/" className={`inline-block ${className}`}>
        <div className={`text-6xl font-display font-black ${bgColor === 'bg-primary-600' ? 'text-primary-600' : bgColor === 'bg-white' ? 'text-white' : 'text-secondary-800'} tracking-[-0.15em] leading-none select-none`}
             style={{ fontWeight: 900, letterSpacing: '-0.15em' }}>
          IWM
        </div>
      </Link>
    )
  }

  // Secondary Logo - Outline IWM
  if (variant === 'secondary') {
    return (
      <Link href="/" className={`inline-block ${className}`}>
        <div className={`text-6xl font-display font-black tracking-[-0.15em] leading-none select-none`}
             style={{ 
               fontWeight: 900, 
               letterSpacing: '-0.15em',
               WebkitTextStroke: `2px ${colorScheme === 'white' ? '#ffffff' : colorScheme === 'black' ? '#333333' : '#A70000'}`,
               color: 'transparent'
             }}>
          IWM
        </div>
      </Link>
    )
  }

  // Horizontal - IWM + ImageWord Ministries
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className={`text-5xl font-display font-black ${bgColor === 'bg-primary-600' ? 'text-primary-600' : bgColor === 'bg-white' ? 'text-white' : 'text-secondary-800'} tracking-[-0.15em] leading-none`}
           style={{ fontWeight: 900, letterSpacing: '-0.15em' }}>
        IWM
      </div>
      <div className="flex flex-col leading-none">
        <span className={`text-base font-display font-bold ${textColor} tracking-tight`}>
          ImageWord
        </span>
        <span className={`text-base font-display font-bold ${textColor} tracking-tight`}>
          Ministries
        </span>
      </div>
    </Link>
  )
}
