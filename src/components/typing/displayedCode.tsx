import React from 'react'

interface displayCodeProps {
  code: string;
  errors: number[];
}

export default function DisplayedCode({ code, errors }: displayCodeProps) {
  return (
    <p className="text-gray-600 mb-4">
    {code.split("").map((char, index) => (
      <span
        key={index}
        className={`${
          errors.includes(index) ? "text-red-500" : "opacity-100"
        }`}
      >
        {char}
      </span>
    ))}
  </p>
  )
}
