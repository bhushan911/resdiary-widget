export async function GET() {
  const result = await fetch("https://jsonplaceholder.typicode.com/posts");

  const data = await result.json();

  return Response.json(data);
}
