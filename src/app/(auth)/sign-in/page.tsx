'use client'
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"

export default function Component() {
    
    const { data: session } = useSession()
   if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
   
  return (
    <>
      Not signed in <br />
      <button className="bg-blue-400 p-3 rounded-lg py-1 px-3 m-4" onClick={() => signIn()}>Sign in</button>
    </>
  )
}