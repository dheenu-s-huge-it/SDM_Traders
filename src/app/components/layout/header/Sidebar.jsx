'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Home,
  People,
  ShoppingCart,
  SwapHoriz,
  Receipt,
  TrendingUp,
  Description,
  Assessment,
  Settings,
  KeyboardArrowDown,
} from '@mui/icons-material'

export default function Sidebar() {
  const [anchorEl, setAnchorEl] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)

  const handleClick = (event, menu) => {
    setAnchorEl(event.currentTarget)
    setActiveMenu(menu)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboards', icon: <Home /> },
    { id: 'users', label: 'All Users', icon: <People /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingCart /> },
    { id: 'transaction', label: 'Transaction', icon: <SwapHoriz /> },
    { id: 'expense', label: 'Expense', icon: <Receipt /> },
    { id: 'income', label: 'Income', icon: <TrendingUp /> },
    { id: 'documents', label: 'Documents', icon: <Description /> },
    { id: 'reports', label: 'Reports', icon: <Assessment /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ]

  return (
    <AppBar position="static" className="bg-gray-900">
      <Toolbar className="gap-2">
        {menuItems.map((item) => (
          <div key={item.id} className="relative">
            <IconButton
              color="inherit"
              onClick={(e) => handleClick(e, item.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-800 ${
                activeMenu === item.id ? 'bg-green-600' : ''
              }`}
            >
              {item.icon}
              <Typography variant="body2" className="ml-1">
                {item.label}
              </Typography>
              <KeyboardArrowDown className="w-4 h-4" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && activeMenu === item.id}
              onClose={handleClose}
              className="mt-2"
            >
              <MenuItem onClick={handleClose}>Option 1</MenuItem>
              <MenuItem onClick={handleClose}>Option 2</MenuItem>
              <MenuItem onClick={handleClose}>Option 3</MenuItem>
            </Menu>
          </div>
        ))}
      </Toolbar>
    </AppBar>
  )
}
