import Spinner from "@/components/ui/spinner";

export default function RaceDetails({
  submittingResults,
}: {
  submittingResults: boolean;
}) {
  return (
    <div className="w-3/4 my-5">
      {submittingResults && (
        <div className="flex items-center">
          <Spinner />
          <p className="ml-2">Submitting your results</p>
        </div>
      )}
    </div>
  );
}
