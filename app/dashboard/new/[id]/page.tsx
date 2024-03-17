import { UpdateNoteButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";


async function getData({ userId, noteId }: { userId: string, noteId: string }) {
    noStore()
    const data = await prisma.note.findUnique({
        where: {
            id: noteId,
            userId: userId,
        },
        select: {
            title: true,
            description: true,
            id: true,
        }
    })

    return data
}

export default async function DynamicRoute({ params }: { params: { id: string } }) {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData({ userId: user?.id as string, noteId: params.id })

    async function postData(formData: FormData) {
        "use server"

        if (!user) throw new Error("You are not allowed")

        const title = formData.get('title') as string
        const description = formData.get('description') as string

        await prisma.note.update({
            where: {
                id: data?.id,
                userId: user?.id
            },
            data: {
                description: description,
                title: title,
            }
        })

        revalidatePath("/dashboard")

        return redirect('/dashboard')
    }

    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Editar nota</CardTitle>
                    <CardDescription>Preencha os campos abaixo para editar sua nota</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="gap-y-2 flex flex-col">
                        <Label>Título</Label>
                        <Input
                            required
                            type="text"
                            name="title"
                            placeholder="Insira um título para sua nota"
                            defaultValue={data?.title}
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                            name="description"
                            placeholder="Insira a descrição de sua nota"
                            required
                            defaultValue={data?.description}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button asChild variant='destructive'>
                        <Link href='/dashboard'>Cancelar</Link>
                    </Button>
                    <UpdateNoteButton />
                </CardFooter>
            </form>
        </Card>
    )
}