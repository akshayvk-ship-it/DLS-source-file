import { Button } from '../../Button';
import { BarChart } from '../../Charts';
import { RupeeSymbolIcon } from '../../Icons';

function LayoutDemoPage({ className = '' }: Readonly<{ className?: string }>) {
  return (
    <div className={`${className} `}>
      {/* Enhanced Header Section */}
      <div className="px-6 pb-6 pt-8">
        <div>
          <h1 className="text-text-text pb-1 text-3xl font-bold">
            Netbanking 2.0 Dashboard
          </h1>
          <p className="text-text-light">
            Welcome back! Here&apos;s what&apos;s happening with your business
            today.
          </p>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Enhanced Key Performance Indicators */}
        <div className="grid auto-rows-min gap-6 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-4">
          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-6 shadow-lg  transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-text-light text-xs font-semibold uppercase tracking-wider">
                    Monthly Revenue
                  </h3>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                </div>
                <p className="text-text-text mt-3 text-3xl font-bold tracking-tight">
                  ₹8,47,329
                </p>
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <svg
                      className="mr-1.5 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +12.5%
                  </span>
                  <span className="text-text-light ml-2 text-xs font-medium">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-blue-200">
                <RupeeSymbolIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-6 shadow-lg  transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-text-light text-xs font-semibold uppercase tracking-wider">
                    Active Customers
                  </h3>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                </div>
                <p className="text-text-text mt-3 text-3xl font-bold tracking-tight">
                  3,247
                </p>
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <svg
                      className="mr-1.5 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +8.2%
                  </span>
                  <span className="text-text-light ml-2 text-xs font-medium">
                    new this month
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-emerald-200">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-6 shadow-lg  transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-text-light text-xs font-semibold uppercase tracking-wider">
                    Transactions
                  </h3>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                </div>
                <p className="text-text-text mt-3 text-3xl font-bold tracking-tight">
                  15,842
                </p>
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <svg
                      className="mr-1.5 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    -2.1%
                  </span>
                  <span className="text-text-light ml-2 text-xs font-medium">
                    vs last month
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-purple-200">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-6 shadow-lg  transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-text-light text-xs font-semibold uppercase tracking-wider">
                    Success Rate
                  </h3>
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                </div>
                <p className="text-text-text mt-3 text-3xl font-bold tracking-tight">
                  97.8%
                </p>
                <div className="mt-4 flex items-center">
                  <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <svg
                      className="mr-1.5 h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +0.3%
                  </span>
                  <span className="text-text-light ml-2 text-xs font-medium">
                    payment success
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 shadow-lg transition-shadow duration-300 group-hover:shadow-green-200">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analytics Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-8 shadow-xl  transition-all duration-300 hover:shadow-2xl lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-text-text mb-2 text-xl font-bold">
                  Revenue Trends
                </h3>
                <p className="text-text-light text-sm">
                  Monthly revenue and transaction volume with predictive
                  analytics
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    className="rounded-md bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-600"
                    type="button"
                  >
                    6M
                  </button>
                  <button
                    className="text-text-lighter rounded-md px-4 py-2 text-xs font-medium transition-all hover:bg-white"
                    type="button"
                  >
                    1Y
                  </button>
                  <button
                    className="text-text-lighter rounded-md px-4 py-2 text-xs font-medium transition-all hover:bg-white"
                    type="button"
                  >
                    All
                  </button>
                </div>
                <button
                  className="rounded-lg bg-gray-50 p-2 transition-colors hover:bg-gray-100"
                  type="button"
                >
                  <svg
                    className="h-4 w-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative h-80 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <div className="bg-grid-slate-100/50 absolute inset-0 rounded-xl bg-[size:20px_20px] opacity-30" />
              <div className="relative">
                <BarChart
                  axisLeftTickFormatter={(e) => e.toString()}
                  barChartData={[
                    { label: 'Jan', value: 45 },
                    { label: 'Feb', value: 78 },
                    { label: 'Mar', value: 65 },
                    { label: 'Apr', value: 89 },
                    { label: 'May', value: 72 },
                    { label: 'Jun', value: 95 },
                    { label: 'Jul', value: 88 },
                  ]}
                  height={280}
                  margins={{ bottom: 40, left: 50, right: 20, top: 25 }}
                  width={600}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-8">
              <div className="flex items-center rounded-lg bg-blue-50 px-4 py-2">
                <div className="mr-3 h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
                <span className="text-sm font-medium text-blue-900">
                  Revenue (₹)
                </span>
              </div>
              <div className="flex items-center rounded-lg bg-indigo-50 px-4 py-2">
                <div className="mr-3 h-3 w-3 rounded-full bg-indigo-400 shadow-sm" />
                <span className="text-sm font-medium text-indigo-900">
                  Transactions
                </span>
              </div>
            </div>
          </div>

          <div className="border-border-border-light group rounded-2xl border bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-text-text text-xl font-bold">
                Payment Methods
              </h3>
              <div className="rounded-lg bg-gray-50 px-3 py-1">
                <span className="text-xs font-semibold text-gray-600 sm:hidden 2xl:block">
                  Live Data
                </span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="group/item flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 transition-all hover:from-blue-100 hover:to-blue-200">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Credit Cards
                    </p>
                    <p className="text-xs text-blue-700 sm:hidden 2xl:block">
                      Visa, Mastercard, Amex
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-900">65%</p>
                  <div className="mt-2 h-2 w-20 rounded-full bg-blue-200">
                    <div className="h-2 w-16 rounded-full bg-blue-600 shadow-sm transition-all group-hover/item:w-16" />
                  </div>
                </div>
              </div>

              <div className="group/item flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-green-100 p-4 transition-all hover:from-green-100 hover:to-green-200">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-900">
                      Net Banking
                    </p>
                    <p className="text-xs text-green-700 sm:hidden 2xl:block">
                      All major banks
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-900">25%</p>
                  <div className="mt-2 h-2 w-20 rounded-full bg-green-200">
                    <div className="h-2 w-5 rounded-full bg-green-600 shadow-sm transition-all" />
                  </div>
                </div>
              </div>

              <div className="group/item flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-4 transition-all hover:from-purple-100 hover:to-purple-200">
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 shadow-lg">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-purple-900">UPI</p>
                    <p className="text-xs text-purple-700 sm:hidden 2xl:block">
                      PhonePe, GPay, Paytm
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-900">10%</p>
                  <div className="mt-2 h-2 w-20 rounded-full bg-purple-200">
                    <div className="h-2 w-2 rounded-full bg-purple-600 shadow-sm transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Analytics Section */}
        <div className="border-border-border-light mb-6 mt-6 rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-text-text text-xl font-bold">
                Business Intelligence Center
              </h3>
              <p className="text-text-light mt-1">
                Real-time insights and performance analytics for your payment
                ecosystem
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                hierarchy="Secondary"
                size="md"
                type="button"
                label="Generate Report"
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="border-border-success rounded-xl border bg-gradient-to-r from-blue-50 to-blue-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                    Transaction Volume
                  </p>
                  <p className="mt-2 text-3xl font-bold text-blue-900">
                    ₹47.2Cr
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-text-success text-sm font-medium">
                      +18.3%
                    </span>
                    <span className="ml-2 text-sm text-blue-700">
                      vs last quarter
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-200 p-3">
                  <svg
                    className="h-8 w-8 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-border-success rounded-xl border bg-gradient-to-r from-green-50 to-green-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-success text-sm font-medium uppercase tracking-wide">
                    Success Rate
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-900">
                    98.7%
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-text-success text-sm font-medium">
                      +0.4%
                    </span>
                    <span className="ml-2 text-sm text-green-700">
                      improvement
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-green-200 p-3">
                  <svg
                    className="h-8 w-8 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-border-info rounded-xl border bg-gradient-to-r from-purple-50 to-purple-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
                    Active Merchants
                  </p>
                  <p className="mt-2 text-3xl font-bold text-purple-900">
                    1,847
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-text-success text-sm font-medium">
                      +127
                    </span>
                    <span className="ml-2 text-sm text-purple-700">
                      new this month
                    </span>
                  </div>
                </div>
                <div className="rounded-full bg-purple-200 p-3">
                  <svg
                    className="h-8 w-8 text-purple-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border-border-action rounded-xl border bg-gradient-to-r from-orange-50 to-orange-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-orange-600">
                    Avg Response Time
                  </p>
                  <p className="mt-2 text-3xl font-bold text-orange-900">
                    127ms
                  </p>
                  <div className="mt-2 flex items-center">
                    <span className="text-text-success text-sm font-medium">
                      -23ms
                    </span>
                    <span className="ml-2 text-sm text-orange-700">faster</span>
                  </div>
                </div>
                <div className="rounded-full bg-orange-200 p-3">
                  <svg
                    className="h-8 w-8 text-orange-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <button
            className="border-border-info group rounded-2xl border bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-8 text-center shadow-lg transition-all duration-300 hover:scale-[1.05] hover:from-blue-100 hover:to-blue-200 hover:shadow-2xl"
            type="button"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-200">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-text-text mb-2 text-lg font-bold">
              Generate Report
            </h4>
            <p className="text-text-light text-sm leading-relaxed">
              Create comprehensive business analytics and performance insights
            </p>
          </button>

          <button
            className="border-border-success group rounded-2xl border bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 p-8 text-center shadow-lg transition-all duration-300 hover:scale-[1.05] hover:from-emerald-100 hover:to-emerald-200 hover:shadow-2xl"
            type="button"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-200">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h4 className="text-text-text mb-2 text-lg font-bold">
              Add Merchant
            </h4>
            <p className="text-text-light text-sm leading-relaxed">
              Onboard new merchant partners with streamlined KYC process
            </p>
          </button>

          <button
            className="border-border-info group rounded-2xl border bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 p-8 text-center shadow-lg transition-all duration-300 hover:scale-[1.05] hover:from-purple-100 hover:to-purple-200 hover:shadow-2xl"
            type="button"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-200">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h4 className="text-text-text mb-2 text-lg font-bold">
              System Config
            </h4>
            <p className="text-text-light text-sm leading-relaxed">
              Advanced payment gateway settings and security preferences
            </p>
          </button>

          <button
            className="border-border-action group rounded-2xl border bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 p-8 text-center shadow-lg transition-all duration-300 hover:scale-[1.05] hover:from-orange-100 hover:to-orange-200 hover:shadow-2xl"
            type="button"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-200">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h4 className="text-text-text mb-2 text-lg font-bold">
              Export Data
            </h4>
            <p className="text-text-light text-sm leading-relaxed">
              Download comprehensive reports and audit trails
            </p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="border-border-border-light mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-text-text text-lg font-semibold">
              Recent Activity
            </h3>
            <button
              className="text-text-action hover:text-text-action-hover text-sm font-medium"
              type="button"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-fill-hover hover:bg-fill-hover-light flex items-start gap-4 rounded-lg p-4 transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="text-text-success h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-text text-sm font-medium">
                  New merchant onboarded
                </p>
                <p className="text-text-lighter mt-1 text-xs">
                  TechCorp Solutions (ID: MCH-2024-0892) completed KYC
                  verification
                </p>
                <div className="text-text-lighter mt-2 flex items-center text-xs">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>12 minutes ago</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Success
                </span>
              </div>
            </div>

            <div className="bg-fill-hover hover:bg-fill-hover-light flex items-start gap-4 rounded-lg p-4 transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v2H6V6zm0 4h8v2H6v-2z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-text text-sm font-medium">
                  High-value transaction processed
                </p>
                <p className="text-text-lighter mt-1 text-xs">
                  ₹2,45,000 payment from QuickMart via Credit Card
                </p>
                <div className="text-text-lighter mt-2 flex items-center text-xs">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>28 minutes ago</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  Processed
                </span>
              </div>
            </div>

            <div className="bg-fill-hover hover:bg-fill-hover-light flex items-start gap-4 rounded-lg p-4 transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="text-text-caution h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-text text-sm font-medium">
                  Payment gateway maintenance
                </p>
                <p className="text-text-lighter mt-1 text-xs">
                  HDFC Bank gateway will be under maintenance from 2:00 AM to
                  4:00 AM
                </p>
                <div className="text-text-lighter mt-2 flex items-center text-xs">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>1 hour ago</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Scheduled
                </span>
              </div>
            </div>

            <div className="bg-fill-hover hover:bg-fill-hover-light flex items-start gap-4 rounded-lg p-4 transition-colors">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="text-text-error h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-text-text text-sm font-medium">
                  Failed transaction alert
                </p>
                <p className="text-text-lighter mt-1 text-xs">
                  ₹15,000 payment failed due to insufficient funds - RetailHub
                </p>
                <div className="text-text-lighter mt-2 flex items-center text-xs">
                  <svg
                    className="mr-1 h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  Failed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutDemoPage;
