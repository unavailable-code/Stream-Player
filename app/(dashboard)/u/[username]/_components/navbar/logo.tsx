import Image from "next/image";
const Logo = () => {
  return (
    <div className="flex gap-x-2 items-center ml-6 hover:opacity-75 transition cursor-pointer">
      <Image
        className="rounded-3xl shrink-0"
        src={"/logo.png"}
        alt="Logo"
        height={50}
        width={50}
      ></Image>
      <div>
        <p className="hidden md:block text-xl text-theme ">Streamer</p>
        <p className="hidden md:block text-md text-muted">
          Creator Dashboard
        </p>
      </div>
    </div>
  );
};
export default Logo;
