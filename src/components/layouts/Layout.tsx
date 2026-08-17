import Header from "./Header";

export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex w-full h-full">
            <Header />
            <main className="flex-1 w-full h-full overflow-hidden bg-background">
                <div className="flex w-full h-full">
                    {/* <Sidebar /> */}
                    <div className="flex-1 w-full overflow-auto">
                        <main className="h-full">
                            {children}
                        </main>
                    </div>
                </div>
            </main>
        </div>  
    )
}