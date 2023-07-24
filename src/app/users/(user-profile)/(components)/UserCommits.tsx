import { Heading } from "@/components/ui/heading";
import { CommitInterface } from "@/types/github";
import { formatDate } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const getUserContributions = async (userEmail: string) => {
  const encodedEmail = encodeURIComponent(userEmail);
  const res = await fetch(
    `https://api.github.com/repos/webdevcody/code-racer/commits?author=${encodedEmail}`,
  ).then((res) => res.json());
  return res ?? [];
};

export default async function UserCommits({
  profileEmail,
}: {
  profileEmail: string;
}) {
  const userCommits =
    ((await getUserContributions(profileEmail)) as CommitInterface[]) ?? [];
  if (userCommits.length === 0) return null;
  return (
    <section className="">
      <div>
        <Heading title="Commits" centered />
      </div>
      <div className="grid gap-4 ">
        {/*TODO: Style this */}
        {userCommits.map((commit, index) => (
          <a
            href={commit.html_url}
            key={index}
            className="flex flex-col gap-2 border border-black/25 dark:border-white/25 py-1 px-4 rounded-lg dark:text-white "
          >
            <h5 className="flex items-center gap-2 text-lg font-semibold">
              {commit.commit.message}{" "}
              <ExternalLink size="16" className="text-warning" />
            </h5>
            <p className="text-sm text-gray-500">
              {formatDate(commit.commit.author.date)}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
