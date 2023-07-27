
export default async function ContributorsPage() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/random`, {
    next: {
      revalidate: 86400
    },
  });
  const {data} = await response.json();

  return <>
    <p>{data}</p>
  </>
}