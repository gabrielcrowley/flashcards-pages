import type { PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <main className="flex h-screen justify-center">
      <div className="flex h-full w-full flex-col border-slate-300 md:max-w-2xl md:border-x">
        {props.children}
      </div>
    </main>
  );
}
