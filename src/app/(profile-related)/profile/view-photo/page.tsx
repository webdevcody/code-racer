import Link from "next/link";
import { SearchParamProfilePicture } from "../_components";

export const metadata = {
  title: "Profile | Profile Picture",
};

export default function ViewPhoto() {
  /** Tried to make the intercepting route method work in this
   * route segment for hours with a separate layout, but it kept sending errors.
   * I'll edit this after I do more studying regarding this. - Ragudos
   */

  return (
    <div className="grid place-items-center z-20 fixed w-full h-full top-0 left-0 bg-monochrome-low-opacity overflow-auto">
      <div className="flex flex-col items-center gap-4 justify-center w-[80%] h-[50%] max-w-[70rem] max-h-[55rem]">
        <div className="w-full flex justify-end">
          <Link
            type="button"
            className="relative w-9 h-9 bg-opacity inline-block hover:bg-monochrome-low-opacity"
            title="Close"
            href={"/profile"}
          >
            <i className="w-full h-1 absolute top-1/2 left-0 rotate-[50deg] bg-monochrome" />
            <i className="w-full h-1 absolute top-1/2 left-0 rotate-[-50deg] bg-monochrome" />
          </Link>
        </div>

        <div className="w-full h-full">
          <SearchParamProfilePicture />
        </div>
      </div>
    </div>
  );
}
