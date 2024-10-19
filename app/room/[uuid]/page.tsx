import Link from "next/link";

export default function ClientHome({params}: Readonly<{ params: { uuid: string } }>) {
    const roomId = params.uuid;
    return (
        <main className="w-full flex flex-col gap-8 row-start-2 justify-center items-center flex-grow">
            <section className="text-center">
                <h2 className="text-2xl">{`Sala Teide`}</h2>
                <p className="text-lg">{roomId}</p>
            </section>
            <form className="flex flex-col gap-4 w-1/3">
                <input className="px-3 py-2 rounded-lg" type="url" placeholder="Pon el link de tu repo..."/>
                <Link className="px-3 py-2 bg-red-500 text-white rounded-lg" href="/thanksgiving">
                    Compartir repo
                </Link>
            </form>
        </main>
    );
}
