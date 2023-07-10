interface displayCodeProps {
  code: string;
  userInput: string;
  errors: number[];
}

export default function DisplayedCode({ code, errors, userInput }: displayCodeProps) {
  return (
    <p className="text-primary mb-4">
      {code.split("").map((char, index) => (
        <span
          key={index}
          className={`
          ${ errors.includes(index) ? "bg-red-500 opacity-100" : "" } 
          ${ userInput[index] === char ? "opacity-100" : "opacity-50" }
        `}
        >
          {char}
        </span>
      ))}
    </p>
  );
}
