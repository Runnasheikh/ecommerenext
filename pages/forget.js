import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const forget = () => {

  const router = useRouter()
  useEffect(() =>{
    if(localStorage.getItem('myUser')){
      router.push('/')}
  }, [])
  return (
    <div>
      hello
    </div>
  )
}

export default forget
