import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center mx-auto h-screen">
      <SignIn />
    </div>
  );
}
