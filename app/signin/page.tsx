'use client';

import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/homepage',
        redirect: false,
      });

      if (result?.error) {
        console.error('Error al iniciar sesión:', result.error);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Bienvenido
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
            Inicia sesión para acceder a tu cuenta
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleSignIn}
            sx={{ width: '100%', maxWidth: 300 }}
          >
            Iniciar sesión con Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
} 