export default function ClientHome({ params }: { params: { uuid: string } }) {
    const roomId = params.uuid;
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>Anonymous Code Review</h1>
                <h2>{`Room ${roomId}`}</h2>
                <form className="flex">
                    <input type="url" placeholder="Pon el link de tu repo..."/>
                    <button className="px-3 py-2 bg-red-500 text-white rounded-lg" type="submit">
                        Clone random repository
                    </button>
                </form>
            </main>
        </div>
    );
}
