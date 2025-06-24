'use client'

import { CalendarMonth, Settings } from '@mui/icons-material'
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  if (!mounted || status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          width: '100%'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!session) {
    return null
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: 'center',
          color: 'text.primary'
        }}
      >
        Bienvenido, {session.user?.name}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr'
          },
          gap: 3,
          maxWidth: 'md',
          width: '100%'
        }}
      >
          <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => router.push('/appointments')}
        >
          <CalendarMonth sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h6" component="h2" align="center">
            Gestión de Turnos
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Administra tus turnos, configura horarios y visualiza tu agenda.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              router.push('/appointments');
            }}
          >
            Ver Turnos
          </Button>
        </Paper>

        <Paper
          sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => router.push('/settings')}
        >
          <Settings sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant="h6" component="h2" align="center">
            Configuración
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Personaliza tu horario de atención y duración de turnos.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              router.push('/homepage/settings');
            }}
          >
            Configurar
          </Button>
        </Paper>
      </Box>
    </Box>
  )
}