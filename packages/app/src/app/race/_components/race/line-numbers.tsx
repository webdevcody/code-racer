type Props = {
  code: string;
  currentLineNumber: number;
};

export default function LineNumbers({ code, currentLineNumber }: Props) {
  return (
    <div className="flex-col px-1 w-10 ">
      {code.split("\n").map((index, line) => (
        <div
          key={line}
          className={
            currentLineNumber === line + 1
              ? "text-center bg-slate-600  border-r-2 border-yellow-500"
              : " text-center border-r-2 border-yellow-500"
          }
        >
          {line + 1}
        </div>
      ))}
    </div>
  );
}
