import AccountForm from './account-form'
import { createClient } from '@/lib/db/server'

export default async function Account() {
  const db = await createClient()

  const {
    data: { user },
  } = await db.auth.getUser()

  return <AccountForm user={user} />
}