import React from "react";
import { Link } from "react-router-dom";

export function NotFound ()  {
  return (<div className="mx-auto relative top-1/2 uppercase max-w-max text-center ">
    <p className="my-2 text-purple-700 font-bold  text-3xl  ">404 Not Found</p>
    <button aria-label="Link to Home" className="bg-yellow-400 text-white p-2 rounded hover:opacity-80 focus:opacity-80 hover:text-black focus:text-black " >
      <Link aria-label="Link to Home" to="/" className="">Home</Link>
    </button>
    </div>)
}

