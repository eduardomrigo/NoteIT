import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import {
    CreditCard,
    LogOut,
    Settings,
} from "lucide-react"

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export const navItems = [
    { name: 'Página Inicial', href: '/dashboard', icon: HomeIcon },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings },
    { name: 'Pagamento', href: '/dashboard/billing', icon: CreditCard },
]

export function UserNav({ name, email, image }: {name: string, email: string, image: string}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className="relative size-10 rounded-full">
                    <Avatar className="size-10 rounded-full">
                        <AvatarImage src={image} alt="Imagem de Perfil" />
                        <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs leading-none text-muted-foreground">{email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {navItems.map((item, index) => (
                        <DropdownMenuItem className="cursor-pointer" asChild key={index}>
                            <Link href={item.href} className="w-full flex justify-between items-center">
                                {item.name}
                                <span><item.icon className="mr-2 size-4" /></span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                  <LogoutLink>
                <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
                  </LogoutLink>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}