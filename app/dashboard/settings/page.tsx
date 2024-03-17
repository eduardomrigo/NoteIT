import { SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";


async function getData(userId: string) {
    noStore()
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            name: true,
            email: true,
            colorScheme: true
        }
    })

    return data
}

export default async function SettingsPage() {

    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData(user?.id as string)

    async function postData(formData: FormData) {
        "use server"

        const name = formData.get('name') as string
        const colorScheme = formData.get('color') as string

        await prisma.user.update({
            where: {
                id: user?.id
            },
            data: {
                name: name ?? undefined,
                colorScheme: colorScheme ?? undefined,
            }
        })

        revalidatePath('/', 'layout')
    }
    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Configurações</h1>
                    <p className="text-lg text-muted-foreground">Suas configurações de perfil</p>
                </div>
            </div>

            <Card>
                <form action={postData}>
                    <CardHeader>
                        <CardTitle>Dados gerais</CardTitle>
                        <CardDescription>
                            Por favor informe os dados gerais sobre sua conta e não se esqueça de salvar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label>Seu nome</Label>
                                <Input
                                    name="name"
                                    type="text"
                                    id="name"
                                    placeholder="Digite seu nome"
                                    defaultValue={data?.name ?? ''}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Seu email</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="Digite seu email" disabled
                                    defaultValue={data?.email ?? ''}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Tema da aplicação</Label>
                                <Select name="color" defaultValue={data?.colorScheme}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma cor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Cores</SelectLabel>
                                            <SelectItem value="theme-green">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#22C55E] size-6 mr-2" />
                                                    Verde
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-blue">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#3B82F6] size-6 mr-2" />
                                                    Azul
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-violet">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#6D28D9] size-6 mr-2" />
                                                    Violeta
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-yellow">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#FACC15] size-6 mr-2" />
                                                    Amarelo
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-orange">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#EA580C] size-6 mr-2" />
                                                    Laranja
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-red">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#DC2626] size-6 mr-2" />
                                                    Vermelho
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="theme-rose">
                                                <div className="flex items-center">
                                                    <span className="[clip-path:circle(40%)] bg-[#E11D48] size-6 mr-2" />
                                                    Rosa
                                                </div>
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}