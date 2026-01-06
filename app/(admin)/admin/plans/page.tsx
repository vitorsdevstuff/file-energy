import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Plans - Admin",
};

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    where: { softDelete: false },
    orderBy: { price: "asc" },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Plans
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage subscription plans
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-900 ${
              plan.isPopular
                ? "border-primary ring-2 ring-primary/20"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                Popular
              </span>
            )}

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  plan.status
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {plan.status ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${plan.price}
              </span>
              <span className="text-gray-500">/{plan.billingCycle}</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">PDFs</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {plan.pdfs}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Questions</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {plan.questions}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Max PDF Size</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {plan.pdfSize}MB
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subscribers</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {plan._count.subscriptions}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Plan Card */}
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
          <Button variant="ghost" className="flex-col gap-2 h-auto py-8">
            <Plus className="h-8 w-8 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Add New Plan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
