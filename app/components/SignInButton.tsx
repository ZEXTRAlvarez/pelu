'use client';

import { Button } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => signIn('google')}
      fullWidth
      sx={{ py: 1.5, fontSize: "1rem" }}
    >
      Ingresar con Google
    </Button>
  );
} 