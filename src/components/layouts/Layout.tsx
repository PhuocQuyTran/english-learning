import Aside from "./Aside";
import Header from "./Header";
import HeaderMobile from "./HeaderMobi";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <div className="sticky top-0 z-50 w-full bg-background border-b border-border md:block hidden">
        <Header />
      </div>
      <div className="flex flex-1 overflow-x-hidden h-screen">
        <div className="md:hidden block">
          <Aside />
        </div>
        <main className="flex-1 md:p-5 px-4 py-5 bg-neutral max-h-[calc(100dvh-60px)] md:max-h-[calc(100dvh-72px)] overflow-y-auto">
          {children}
        </main>
      </div>
      <div className="sticky bottom-0 z-50 w-full bg-background border-t border-border md:hidden block">
        <HeaderMobile />
      </div>
    </div>
  );
}
