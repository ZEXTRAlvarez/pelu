'use client'

import { Box, CircularProgress } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isRolePage = pathname === '/homepage/role'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {!isRolePage && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 'lg',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}