import Link from "next/link";
const Notfound = () => {
  return (
    <main className="flex items-center text-black gap-5 justify-center flex-col relative top-16  py-[150px]">
      <h2 className="text-[47px] font-semibold">Oops! Something went wrong:(  </h2>
      <p className="text-2xl">The page you are looking for can't be found.</p>
     
      <p className="text-2xl">Maybe the links below can be helpful.</p>
      <p>
        <Link href="/" className=" underline">
        Go back to the Ayatrio homepage
        </Link>
      </p>
    </main>
  );
};

export default Notfound;
