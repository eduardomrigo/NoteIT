"use client"

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { Loader2, LoaderCircle, Trash } from "lucide-react"



export function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Salvando
            </Button>
        ) : (

            <Button type="submit">Salvar</Button>
        )}</>
    )
}

export function StripeSubscriptionCreatinButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button className="w-full" disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Redirecionando
            </Button>
        ) : (

            <Button type="submit" className="w-full">Fazer Upgrade</Button>
        )}</>
    )
}


export function StripePortalButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button className="w-fit" disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Redirecionando
            </Button>
        ) : (

            <Button type="submit" className="w-fit">Acessar portal</Button>
        )}</>
    )
}

export function CreateNoteButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Criando nota
            </Button>
        ) : (

            <Button type="submit">Criar nota</Button>
        )}</>
    )
}

export function UpdateNoteButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button disabled>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Atualizando nota
            </Button>
        ) : (

            <Button type="submit">Atualizar nota</Button>
        )}</>
    )
}

export function TrashDeleteButton() {
    const { pending } = useFormStatus()
    return (
        <>{pending ? (
            <Button className="w-full sm:w-10 md:w-10 lg:w-10" disabled variant='destructive' size='icon'>
                <Loader2 className="size-4 animate-spin" />
            </Button>
        ) : (

            <Button className="w-full sm:w-10 md:w-10 lg:w-10" type="submit" variant='destructive' size='icon'>
                <Trash className="size-4" />
            </Button>
        )}</>
    )
}

