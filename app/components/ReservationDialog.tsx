import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

interface ReservationDialogProps {
  open: boolean;
  slot: { start: string; end: string } | null;
  clientName: string;
  clientPhone: string;
  setClientName: (name: string) => void;
  setClientPhone: (phone: string) => void;
  setOpenDialog: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ReservationDialog = ( {open, slot, clientName, clientPhone, setClientName, setClientPhone, setOpenDialog, onClose, onConfirm} : ReservationDialogProps)  => {
  const [phoneError, setPhoneError] = useState('');

  const validatePhone = (phone: string) => {
    // Remover espacios y caracteres especiales
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 0) {
      setPhoneError('');
      return true;
    }
    
    if (cleanPhone.length !== 10) {
      setPhoneError('El teléfono debe tener exactamente 10 dígitos');
      return false;
    }
    
    if (!/^\d{10}$/.test(cleanPhone)) {
      setPhoneError('El teléfono debe contener solo números');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '');
    setClientPhone(numericValue);
    validatePhone(numericValue);
  };

  const handleConfirm = () => {
    if (validatePhone(clientPhone)) {
      onConfirm();
    }
  };

  return (
     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Reservar turno</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">
            Horario: {slot ? `${slot.start} - ${slot.end}` : 'No seleccionado'}
          </Typography>
          <TextField
            label="Nombre del Cliente"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Teléfono del Cliente (formato: 3547599999)"
            value={clientPhone}
            onChange={handlePhoneChange}
            fullWidth
            required
            error={!!phoneError}
            helperText={phoneError || "Sin 0 y sin 15, solo números"}
            inputProps={{
              maxLength: 10,
              pattern: '[0-9]*'
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setOpenDialog(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirm} 
            disabled={!clientName || !clientPhone || !!phoneError}
          >
            Reservar
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default ReservationDialog
