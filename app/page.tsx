import { Button } from "@/components/ui/button";
import { Show, SignInButton, SignUpButton, UserAvatar } from "@clerk/nextjs";


export default function Home() {
  return (
    <div>
      <h1>Hello next js</h1>
      <Button>
        Click me
      </Button>
      <Show when={"signed-out"}>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal">
           Sign up
        </SignUpButton>
      </Show>
      <Show when={"signed-out"}>
         <UserAvatar />
      </Show>
    </div>
  );
}
