"use client";
import qs from "query-string";
import { SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const onsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value) return;
    const url = qs.stringifyUrl(
      {
        url: "/search",
        query: { term: value },
      },
      { skipEmptyString: true }
    );
    router.push(url);
  };
  const onclear = () => setValue("");
  return (
    <form
      className="relative w-full lg:w-[400px] flex items-center md:ml-14 ml-4"
      onSubmit={onsubmit}
    >
      <Input
        className="bg-[#16181f] text-white rounded-r-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-0 h-9"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <X
          onClick={onclear}
          className="absolute right-14 text-muted-foreground h-5 w-5 hover:opacity-75 transition cursor-pointer top-2.5"
        />
      )}
      <Button
        type="submit"
        size="sm"
        className=" bg-[#2b2d35] text-muted-foreground rounded-l-none"
      >
        <SearchIcon />
      </Button>
    </form>
  );
};

export default Search;
