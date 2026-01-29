// app/customers/page.tsx
import CustomersTable from '@/app/ui/customers/table'
import { fetchFilteredCustomers } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers' }

export default async function Page() {

  const customers = await fetchFilteredCustomers('')

  return (
    <div>
      <CustomersTable customers={customers} />
    </div>
  )
}
