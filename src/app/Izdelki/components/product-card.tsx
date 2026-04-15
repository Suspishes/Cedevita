'use client'

import React from 'react'
import Link from 'next/link'
import { Euro, ShoppingCart, Plus, Minus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton
} from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useKosaricaStore, type Izdelek as KosaricaIzdelek } from '../../kosarica/components/backend'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6CA748',
    },
    secondary: {
      main: '#5A8E3A',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

interface ProductCardProps {
  izdelek: Partial<KosaricaIzdelek> & { IzdelkiID: number; Ime: string; Cena?: number | null; Proizvajalec?: string; Slika?: string; Opis?: string | null }
}

export default function ProductCard({ izdelek }: ProductCardProps) {
  const kosarica = useKosaricaStore((state) => state.kosarica)
  const dodajIzdelek = useKosaricaStore((state) => state.dodajIzdelek)
  const povecajKolicino = useKosaricaStore((state) => state.povecajKolicino)
  const zmanjsajKolicino = useKosaricaStore((state) => state.zmanjsajKolicino)
  const odstraniIzdelek = useKosaricaStore((state) => state.odstraniIzdelek)

  const cartItem = kosarica.find((i) => i.IzdelkiID === izdelek.IzdelkiID)

  const handleAdd = () => {
    // Cast to full Izdelek shape expected by the store where possible
    const toAdd = {
      IzdelkiID: izdelek.IzdelkiID,
      Ime: izdelek.Ime,
      Cena: izdelek.Cena ?? 0,
      Proizvajalec: izdelek.Proizvajalec ?? '',
      Slika: izdelek.Slika ?? '',
      Opis: izdelek.Opis ?? '',
      KolicinaNaZalogi: (cartItem?.KolicinaNaZalogi ?? 0),
      KolicinaVKosarici: 1,
    } as KosaricaIzdelek
    dodajIzdelek(toAdd)
  }

  const handleIncrease = () => {
    if (cartItem) povecajKolicino(cartItem.IzdelkiID)
  }

  const handleDecrease = () => {
    if (!cartItem) return
    if (cartItem.KolicinaVKosarici > 1) {
      zmanjsajKolicino(cartItem.IzdelkiID)
    } else {
      // if quantity would go to 0, remove item
      odstraniIzdelek(cartItem.IzdelkiID)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.01)',
          boxShadow: 6,
        }
      }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineClamp: 2 }}>
              {izdelek.Ime}
            </Typography>
          }
          action={
            <Chip
              label={izdelek.Proizvajalec ?? ''}
              variant="outlined"
              sx={{
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            />
          }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          {izdelek.Slika ? (
            <Box
              sx={{
                position: 'relative',
                height: '200px',
                bgcolor: 'grey.100',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                '& img': {
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', // show full image without cropping
                  objectPosition: 'center',
                  transition: 'transform 0.35s ease',
                },
                '&:hover img': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <img
                src={izdelek.Slika || '/placeholder.svg'}
                alt={izdelek.Ime}
              />
            </Box>
          ) : (
            <Box
              sx={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100',
                borderRadius: '8px'
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Ni slike
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2, lineClamp: 3 }}>
            {izdelek.Opis ?? "Brez opisa"}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #e0e0e0',
            padding: '12px',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Euro size={16} style={{ marginRight: '4px', color: 'gray' }} />
            <Typography fontWeight="medium">
              {typeof izdelek.Cena === 'number' && izdelek.Cena !== null ? `${izdelek.Cena.toFixed(2)} €` : "Ni cene"}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {cartItem ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={handleDecrease} aria-label="zmanjšaj količino" sx={{ width: 28, height: 28 }}>
                  <Minus size={12} />
                </IconButton>
                <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>{cartItem.KolicinaVKosarici}</Typography>
                <IconButton size="small" onClick={handleIncrease} aria-label="povečaj količino" sx={{ width: 28, height: 28 }}>
                  <Plus size={12} />
                </IconButton>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => odstraniIzdelek(cartItem.IzdelkiID)}
                  sx={{ ml: 1, py: 0.5, px: 1 }}
                  size="small"
                >
                  Odstrani
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<ShoppingCart size={14} />}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'common.white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  py: 0.5,
                  px: 1
                }}
              >
                Dodaj v košarico
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              component={Link}
              href={`/Izdelki/${izdelek.IzdelkiID}`}
              passHref
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                py: 0.5,
                px: 1
              }}
            >
              Poglej
            </Button>
          </Box>
        </CardActions>
      </Card>
    </ThemeProvider>
  )
}