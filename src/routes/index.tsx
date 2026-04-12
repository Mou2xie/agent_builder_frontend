import { supabaseClient } from "../libs/supabaseClient"

export const IndexPage = () => {

  return (
    <>
      <div>
        <p>Welcome to the landing page!</p>
        <div className=" flex flex-col gap-5">
          <button onClick={() => supabaseClient.auth.signOut()}>log out</button>
        </div>
      </div>
    </>
  )
}

