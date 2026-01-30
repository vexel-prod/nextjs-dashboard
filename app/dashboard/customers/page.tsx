import CustomersTable from '@/app/ui/customers/table'
import Pagination from '@/app/ui/invoices/pagination'
import { fetchCustomersPages, fetchFilteredCustomers } from '@/app/lib/data'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { CustomersTableSkeleton } from '@/app/ui/skeletons'

export const metadata: Metadata = { title: 'Customers' }

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchCustomersPages(query)
  const customers = await fetchFilteredCustomers(query, currentPage)

  return (
    <div>
      <Suspense
        key={query + currentPage}
        fallback={<CustomersTableSkeleton />}
      >
        <CustomersTable
          customers={customers}
        />
      </Suspense>
      <div className='mt-5 flex w-full justify-center'>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}
