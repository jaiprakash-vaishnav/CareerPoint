import React from 'react'
import Navbar from '@/components/Navbar/index.jsx'

function User({children}) {
  return (
    <div>
        <Navbar/>
      {children}
    </div>
  )
}

export default User