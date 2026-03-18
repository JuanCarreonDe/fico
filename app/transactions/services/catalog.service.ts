import { createClient } from "@/lib/db/server"

// export const getUserAccounts = async () => {
//   const db = createClient()
//       const { data, error } = await (await db).rpc(
//     "get_user_accounts"
//   )
//   if (error) throw error

//   return data
// }

// export const getUserCategories = async () => {
//   const db = createClient()
//       const { data, error } = await (await db).rpc(
//     "get_user_categories"
//   )
//   if (error) throw error

//   return data
// }