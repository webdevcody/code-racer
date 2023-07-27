export const dynamic = "force-dynamic"

export default async function RandomPage() {
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