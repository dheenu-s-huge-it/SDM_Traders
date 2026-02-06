'use client'

// Next Imports
import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const NotFound = () => {
  // Vars

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            Token Expired
          </Typography>
          <Typography variant='h4'>Page Not Found ⚠️</Typography>
          <Typography>we couldn&#39;t find the page you are looking for.</Typography>
        </div>
        <Button href='/' component={Link} variant='contained'>
          Back To Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
