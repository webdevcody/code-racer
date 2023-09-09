import { getCurrentUser } from "@/lib/session";
import dynamic from "next/dynamic";

const AuthenticatedPage = dynamic(() => import("./(pages)/authenticated"));
const UnauthenticatedPage = dynamic(() => import("./(pages)/unauthenticated"));

type ResultPageProps = {
  searchParams: {
    resultId: string;
    snippetId: string;
  };
};

export default async function ResultPage({ searchParams }: ResultPageProps) {
  const user = await getCurrentUser();

  return user ? (
    <AuthenticatedPage user={user} resultId={searchParams.resultId} />
  ) : (
    <UnauthenticatedPage snippetId={searchParams.snippetId} />
  );
}

