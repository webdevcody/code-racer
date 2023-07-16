import Spinner from "@/components/ui/spinner";

interface RaceDetailsProps {
  submittingResults: boolean;
}

export default function RaceDetails({ submittingResults }: RaceDetailsProps) {
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
