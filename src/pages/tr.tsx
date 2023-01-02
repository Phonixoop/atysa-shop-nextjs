import { trpc } from "utils/trpc";

export default function TestPage() {
  const hello = trpc.example.hello.useQuery({ text: "trpc" });
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
