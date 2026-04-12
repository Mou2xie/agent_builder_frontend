import { supabaseClient } from "../libs/supabaseClient"
import { useAuthStore } from "../stores/useAuthStore";

export const IndexPage = () => {
  const user = useAuthStore(state => state.user);


  return (
    <>
      <div>
        <p>Welcome to the landing page!</p>
        <div className=" flex flex-col gap-5">
          <button onClick={() => supabaseClient.auth.signOut()}>log out</button>
          <button onClick={async () => {
            console.log("当前登录的用户:", user?.id);

            // 2. 执行删除操作
            const res = await supabaseClient
              .from("documents")
              .delete()
              .eq("id", 111);

            console.log("删除结果:", res);
          }}
            className="w-48 mx-auto py-1 bg-amber-600">delete documents</button>
        </div>
      </div>
    </>
  )
}

