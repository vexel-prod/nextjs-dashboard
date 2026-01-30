import 'dotenv/config'
import { Client } from 'pg'
import { v5 as uuidv5 } from 'uuid'

const DATABASE_URL = process.env.POSTGRES_URL!
const MOCK_URL = 'https://6972725932c6bacb12c6eec6.mockapi.io/users'

// фиксированный namespace (не меняй потом)
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
async function fetchAllUsers() {
  const out: any[] = []
  let page = 1
  const limit = 100

  while (true) {
    const url = new URL(MOCK_URL)
    url.searchParams.set('page', String(page))
    url.searchParams.set('limit', String(limit))

    const res = await fetch(url)
    if (!res.ok) throw new Error(`MockAPI error: ${res.status}`)
    const chunk = await res.json()

    if (!Array.isArray(chunk) || chunk.length === 0) break
    out.push(...chunk)

    if (chunk.length < limit) break
    page += 1
  }

  return out
}

async function main() {
  const users = await fetchAllUsers()

  const client = new Client({ connectionString: DATABASE_URL })
  await client.connect()

  await client.query('BEGIN')
  try {
    const q = `
      INSERT INTO customers (id, name, email, image_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        image_url = EXCLUDED.image_url;
    `

    for (const u of users) {
      const id = uuidv5(String(u.id), NAMESPACE)
      const name = u.name ?? null
      const email = u.email ?? null
      const imageUrl = u.avatar ?? null

      await client.query(q, [id, name, email, imageUrl])
    }

    await client.query('COMMIT')
    console.log(`Imported/updated: ${users.length} users`)
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    await client.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
