"use server";
import Button from "./components/Button";
import NewSheetButton from "./components/NewSheetButtonServer";

export default async function Home() {
  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div className="mx-auto max-w-2xl py-20 sm:py-32 py- lg:py-36">
          <div className="relative text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Heli&nbsp;Notes
            </h1>
            <hr className="-z-10 absolute w-5/6 right-4 top-4 bg-gray-600" />
            <hr className="-z-10 absolute w-5/6 right-6 top-6 bg-gray-600" />
            <hr className="-z-10 absolute w-5/6 right-8 top-8 bg-gray-600" />
            <hr className="-z-10 absolute w-5/6 right-10 top-10 bg-gray-600" />
            <hr className="-z-10 absolute w-5/6 right-12 top-12 bg-gray-600" />
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Databáza piesní pre Heligónku.
              <br />
              Vytvor si vlastný zápis v jednoduchom editore a zdieľaj s
              ostatnými muzikantmi.
              <br />
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Button variant="primary" href="/filter">
                Prezeraj
              </Button>
              <span className="text-sm text-gray-500">alebo</span>
              <NewSheetButton />
            </div>
            <a
              className="text-gray-500 inline-block mt-8 text-sm"
              href="https://martincernansky.com/"
              target="_blank"
            >
              Tabuľková metóda zápisu podľa Martina Čerňanského
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
