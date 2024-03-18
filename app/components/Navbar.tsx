import Link from 'next/link'
import React from 'react'
import { ThemeToggler } from './theme-toggler'
import { Button } from '@/components/ui/button'

import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserNav } from './UserNav';



const Navbar = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession(); 
    const user = await getUser()

    return (
        <nav className='border-b bg-background h-[10vh] flex items-center'>
            <div className='container flex items-center justify-between'>
                <Link href='/'>
                    <h1 className='font-bold text-3xl'>Note <span className='text-primary'>IT</span></h1>
                </Link>

                <div className='flex items-center gap-x-5'>
                    <ThemeToggler />

                    {(await isAuthenticated()) ? (
                        <UserNav
                            firstname={user?.given_name as string}
                            lastname={user?.family_name as string}
                            email={user?.email as string}
                            image={user?.picture as string}
                        />
                    ) : (
                        <div className='flex items-center gap-x-5'>
                            <LoginLink>
                                <Button>Login</Button>
                            </LoginLink>
                            <RegisterLink>
                                <Button variant='secondary'>Cadastrar</Button>
                            </RegisterLink>

                        </div>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Navbar