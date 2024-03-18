import prisma from "@/app/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import { StripeCardButton, StripePortalButton, StripeSubscriptionCreatinButton } from "@/app/components/SubmitButtons";
import { unstable_noStore as noStore } from "next/cache";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";


const proItens = [
    { name: 'Gere quantas notas quiser' },
    { name: 'Suporte por WhatsApp' },
    { name: 'Badge de membro PRO' },
]

async function getData(userId: string) {
    noStore()
    const data = await prisma.subscription.findUnique({
        where: {
            userId: userId,
        },
        select: {
            status: true,
            user: {
                select: {
                    stripeCustomerId: true,
                }
            }
        }
    })

    return data
}

export default async function BillingPage() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    const data = await getData(user?.id as string)

    async function createSubscription() {
        "use server"

        const dbUser = await prisma.user.findUnique({
            where: {
                id: user?.id
            },
            select: {
                stripeCustomerId: true,
            }
        })

        if (!dbUser?.stripeCustomerId) {
            throw new Error("Unable to get customer id")
        }

        const subscriptionUrl = await getStripeSession({
            customerId: dbUser.stripeCustomerId,
            domainUrl: process.env.KINDE_SITE_URL as string,
            priceId: process.env.STRIPE_PRICE_ID as string,
        })

        return redirect(subscriptionUrl)
    }

    async function createCustomerPortal() {
        "use server"
        const session = await stripe.billingPortal.sessions.create({
            customer: data?.user.stripeCustomerId as string,
            return_url: process.env.KINDE_SITE_URL as string,
        })

        return redirect(session.url)
    }

    if (data?.status === 'active') {
        return (
            <div className="grid items-start gap-8">
                <div className="flex items-center justify-between px-2">
                    <div className="grid gap-1">
                        <h1 className="text-3xl md:text-4xl">Plano</h1>
                        <p className="text-lg text-muted-foreground">Configurações do seu plano</p>
                    </div>
                </div>

                <Card className="w-full lg:w-2/3">
                    <CardHeader>
                        <CardTitle>Você tem um plano <span className="text-primary">Pro</span></CardTitle>
                        <CardDescription>
                            Acesse as configurações do seu plano no portal da <span className="text-primary">Stripe</span> clicando no botão abaixo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createCustomerPortal}>
                            <StripePortalButton />
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto space-y-4">
            <Card className="flex flex-col">
                <CardContent className="py-8">
                    <div>
                        <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide bg-primary/10 text-primary">Mensal</h3>
                    </div>
                    <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                        R$15 <span className="ml-1 text-2xl text-muted-foreground">/mês*</span>
                    </div>

                    <Separator />
                    <p className="mt-4 text-sm text-muted-foreground">* Utilize o cartão de teste do <span className="text-primary">Stripe:</span></p>


                    <div className="mt-4 gap-2 flex items-center">
                        <Input className="w-fit" type="text" disabled value={'4242-4242-4242-4242'} />
                        <StripeCardButton />
                    </div>


                </CardContent>
                <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
                    <ul className="space-y-4">
                        {proItens.map((item, index) => (
                            <li key={index} className="flex items-center">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="size-6 text-green-500" />
                                </div>
                                <p className="ml-3 text-base">{item.name}</p>
                            </li>
                        ))}
                    </ul>

                    <form className="w-full" action={createSubscription}>
                        <StripeSubscriptionCreatinButton />
                    </form>
                </div>
            </Card>
        </div>
    )
}