export const metadata = {
  title: {
    absolute: "Loading Profile Page",
  },
};

export default function Loading() {
  return (
    <h1 className="text-center">
      <span className="loading loading-spinner loading-lg"></span>
    </h1>
  );
}
