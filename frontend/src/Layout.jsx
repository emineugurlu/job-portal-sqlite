// frontend/src/Layout.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Layout({ children, page, token, onNav, onLogout }) {
  const [open, setOpen] = useState(false);

  const pages = [
    { label: 'İlanlar',     key: 'jobs' },
    { label: 'Yeni İlan',   key: 'new' },
    { label: 'Kategoriler', key: 'categories' },
    { label: 'Profil',      key: 'profile' }
  ];

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobPortal
          </Typography>

          {token
            ? <Button color="inherit" onClick={onLogout}>
                Çıkış Yap
              </Button>
            : <Button color="inherit" onClick={() => onNav('login')}>
                Giriş
              </Button>
          }
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation">
          <List>
            {pages.map(p => (
              <ListItem
                button
                key={p.key}
                selected={page === p.key}
                onClick={() => { onNav(p.key); setOpen(false); }}
              >
                <ListItemText primary={p.label} />
              </ListItem>
            ))}

            {!token && (
              <ListItem
                button
                selected={page === 'register'}
                onClick={() => { onNav('register'); setOpen(false); }}
              >
                <ListItemText primary="Kayıt Ol" />
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </>
  );
}
