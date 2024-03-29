import { CreateNoteButton, SubmitButton } from "@/app/components/SubmitButtons";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/app/components/breadcrumbs";

export default async function NewNoteRoute() {

    noStore()

    const { getUser } = getKindeServerSession();
    const user = await getUser()

    async function postData(formData: FormData) {
        "use server"

        if (!user) {
            throw new Error("Not authorized")
        }

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        await prisma.note.create({
            data: {
                userId: user?.id,
                description: description,
                title: title,
            }
        })

        return redirect('/dashboard')

    }

    return (
        <div className="grid items-start gap-8">
            <Breadcrumbs path='Criar Nota' />
            <Card>
                <form action={postData}>
                    <CardHeader>
                        <CardTitle>Nova nota</CardTitle>
                        <CardDescription>Preencha os campos abaixo para criar uma nova nota</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-y-5">
                        <div className="gap-y-2 flex flex-col">
                            <Label>Título</Label>
                            <Input
                                required
                                type="text"
                                name="title"
                                placeholder="Insira um título para sua nota"
                            />
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <Label>Descrição</Label>
                            <Textarea
                                name="description"
                                placeholder="Insira a descrição de sua nota"
                                required
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                        <Button asChild variant='destructive'>
                            <Link href='/dashboard'>Cancelar</Link>
                        </Button>
                        <CreateNoteButton />
                    </CardFooter>
                </form>
            </Card>
        </div>

    )
}