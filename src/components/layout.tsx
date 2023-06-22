import type { PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <main className="h-screen flex justify-center">
      <div className="flex h-full w-full flex-col md:max-w-2xl border-x border-slate-300">
        {props.children}
      </div>
    </main>
  )
}