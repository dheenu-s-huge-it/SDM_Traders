'use client'

// Component Imports
import Navigation from '../header/Navigation'
import NavbarContent from '../header/NavbarContent'
import Navbar from '../../../../@layouts/components/horizontal/Navbar'
import LayoutHeader from '../../../../@layouts/components/horizontal/Header'

// Hook Imports
import useHorizontalNav from '../../../../@menu/hooks/useHorizontalNav'

const Header = ({ dictionary }) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          <NavbarContent />
        </Navbar>
        {!isBreakpointReached && <Navigation dictionary={dictionary} />}
      </LayoutHeader>
      {isBreakpointReached && <Navigation dictionary={dictionary} />}
    </>
  )
}

export default Header
