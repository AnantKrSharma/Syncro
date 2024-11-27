'use client';

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

function SignUpButton() {
  return (
    <Button className="bg-purple-600 text-white hover:bg-purple-700 w-1/2" 
                          onClick={() => signIn()}
                  > Sign Up
    </Button>
  )
}

export default SignUpButton;
