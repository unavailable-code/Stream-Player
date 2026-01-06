
import { ThemeDropdown } from "@/components/theme-swticher";
import Action from "./actions";
import Logo from "./logo";

export const Navbar = () => {
  return (
    <div className="bg-card z-10 h-20 w-full fixed top-0 px-2 lg:px-4 flex justify-between items-center shadow-sm">
      <Logo />
      <Action />
    </div>
  );
};
