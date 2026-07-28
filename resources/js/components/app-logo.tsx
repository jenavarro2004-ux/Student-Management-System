import { GraduationCap } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GraduationCap className="size-5" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">SMS</span>
                <span className="truncate text-xs text-muted-foreground">Admin Portal</span>
            </div>
        </>
    );
}
