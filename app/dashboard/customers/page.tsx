import CustomersTable from '@/app/ui/customers/table'
import { fetchFilteredCustomers } from '@/app/lib/data'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = { title: 'Customers' }

export default async function Page() {
  const customers = await fetchFilteredCustomers('')

  return (
    <div>
      <Suspense fallback={null}>
        <CustomersTable customers={customers} />
      </Suspense>
    </div>
  )
}
