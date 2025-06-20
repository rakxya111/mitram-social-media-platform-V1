import { Loader } from "lucide-react";
import GridPostList from "./GridPostList";
import type { Post } from "@/types";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Post[];  // this is a plain array, not an object
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
  if (isSearchFetching) return <Loader className="animate-spin" />;

  if (searchedPosts.length > 0) {
    return <GridPostList posts={searchedPosts} />;
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found.</p>
  );
};

export default SearchResults;
