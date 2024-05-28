import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const MyAccount = () => {
    const router = useRouter()
    useEffect(() =>{
        if(localStorage.getItem('myUser')){
          router.push('/')}
      }, [])
      
  return (
    <div>
      my accpount
    </div>
  )
}

export default MyAccount
