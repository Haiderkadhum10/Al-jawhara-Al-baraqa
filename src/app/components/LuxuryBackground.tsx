
export function LuxuryBackground() {

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute bottom-0 w-full h-full bg-[radial-gradient(#c9a85c15_1px,transparent_1px)] [background-size:40px_40px] opacity-20" />
        </div>
    );
}
