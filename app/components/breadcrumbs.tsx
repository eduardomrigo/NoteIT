import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Paths {
    path?: string;
    value?: string
    index?: string;
}

export const Breadcrumbs = ({ path }: Paths) => {
    const pathnames = path ? path.split('/').filter(x => x) : []
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                    return last ? (
                        <BreadcrumbItem key={to}>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>{value}</BreadcrumbPage>
                        </BreadcrumbItem>
                    ) : (
                        <BreadcrumbItem key={to}>
                            <BreadcrumbSeparator />
                            <BreadcrumbLink href={to}>{value}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>

    )
}
