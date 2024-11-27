'use client';

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import React from 'react'

function LogOutButton() {
  return (
    <Button className="bg-purple-600 text-white hover:bg-purple-700 w-1/4" 
                          onClick={() => signOut()}
                  > Log Out
    </Button>
  )
}

export default LogOutButton;
