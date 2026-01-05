import Action from "./actions";
import Logo from "./logo";
import Search from "./search";

export const Navbar = () => {
  return (
    <div className="bg-[#252731] h-20 w-full fixed top-0 px-2 lg:px-4 flex justify-between items-center shadow-sm">
      <Logo />
      <Search />
      <Action />
    </div>
  );
};
