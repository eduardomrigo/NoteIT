import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { TrashDeleteButton } from "../components/SubmitButtons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Breadcrumbs } from "../components/breadcrumbs";

async function getData(userId: string) {

  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Note: {
        select: {
          title: true,
          id: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });

  return data;
}

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";

    const noteId = formData.get("noteId") as string;

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
    revalidatePath("/dashboard");
  }
  return (
    <div className="grid items-start gap-y-8">
      <Breadcrumbs path={'/Página Inicial'} />
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl">Suas notas</h1>
          <p className="text-lg text-muted-foreground">
            Veja e crie suas notas aqui
          </p>
        </div>

        {data?.Subscription?.status === "active" ? (
          <Button asChild>
            <Link href="/dashboard/new">Criar nota</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/billing">Criar nota</Link>
          </Button>
        )}
      </div>

      {data?.Note.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Nenhuma nota criada
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            Crie alguma nota e ela irá aparecer neste espaço
          </p>

          {data?.Subscription?.status === "active" ? (
            <Button asChild>
              <Link href="/dashboard/new">Criar nota</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard/billing">Criar nota</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-5 w-full mt-3">
          {data?.Note.map((item) => (
            <Card
              key={item.id}
              className="w-100 flex items-center justify-between p-4"
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold text-xl text-primary">
                  {item.title}
                </h2>
                <p className="w-[160px] lg:w-[350px] overflow-hidden text-ellipsis whitespace-nowrap;">{item.description}</p>
                <p className="text-muted-foreground">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "medium",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>

              <div className="flex gap-x-4">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/dashboard/new/${item.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar nota</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialog>

                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button variant='destructive' size='icon'>
                            <Trash className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Deletar nota</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>


                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você deseja excluir essa nota?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não poderá ser desfeita!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>

                      <form action={deleteNote}>
                        <input type="hidden" name="noteId" value={item.id} />
                        <TrashDeleteButton />
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}