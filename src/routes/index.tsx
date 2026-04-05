import { supabaseClient } from "../libs/supabaseClient"

export const IndexPage = () => {

  return (
    <>
      <div>
        <p>Welcome to the landing page!</p>
        <button onClick={() => supabaseClient.auth.signOut()}>log out</button>
      </div>
    </>
  )
}

