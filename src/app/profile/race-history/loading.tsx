export const metadata = {
  title: {
    absolute: "Loading Race History",
  },
};

export default function Loading() {
  return (
    <h1 className="text-center">
      Loading History...
      <span className="loading loading-spinner loading-lg"></span>
    </h1>
  );
}
