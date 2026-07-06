"use client";

import { ArrowLeftRight, Landmark, Users } from "lucide-react";

import { useAccounts } from "../../src/hooks/useAccounts";
import { useClients } from "../../src/hooks/useClients";
import { useTransactions } from "../../src/hooks/useTransactions";

import { DashboardHero } from "../../src/components/dashboard/DashboardHero";
import { StatCard } from "../../src/components/dashboard/StatCard";
import { ModuleCard } from "../../src/components/dashboard/ModuleCard";
import { Card } from "../../src/components/ui/Card";

// ESTOS LOS CREAREMOS EN EL SIGUIENTE PASO
import { ActivityCard } from "../../src/components/dashboard/ActivityCard";
import { QuickActions } from "../../src/components/dashboard/QuickActions";

const moduleLinks = [
  {
    title: "Clientes",
    description: "Administra toda la información de los clientes.",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    title: "Productos",
    description: "Gestiona cuentas de ahorro y corrientes.",
    href: "/dashboard/cuentas",
    icon: Landmark,
  },
  {
    title: "Transacciones",
    description: "Controla retiros, consignaciones y transferencias.",
    href: "/dashboard/transacciones",
    icon: ArrowLeftRight,
  },
];

export default function DashboardPage() {
  const { clients = [], isLoading: clientsLoading } = useClients();

  const { accounts = [], isLoading: accountsLoading } = useAccounts();

  const { transactions = [], isLoading: transactionsLoading } =
    useTransactions();

  const loading =
    clientsLoading ||
    accountsLoading ||
    transactionsLoading;

  const stats = [
    
    {
      title: "Clientes",
      value: loading ? "..." : String(clients.length),
      subtitle: "Clientes registrados",
      icon: Users,
      accentClass: "bg-blue-100 text-blue-600",
    },
    {
      title: "Productos",
      value: loading ? "..." : String(accounts.length),
      subtitle: "Cuentas activas",
      icon: Landmark,
      accentClass: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Transacciones",
      value: loading ? "..." : String(transactions.length),
      subtitle: "Operaciones realizadas",
      icon: ArrowLeftRight,
      accentClass: "bg-violet-100 text-violet-600",
    },
  ];
  const activities = [
    ...clients.map((client) => ({
      type: "CLIENT" as const,
      title: "Nuevo cliente registrado",
      description: `${client.firstName} ${client.lastName}`,
      date: new Date(client.createdAt),
    })),

    ...accounts.map((account) => ({
      type: "ACCOUNT" as const,
      title: "Cuenta creada",
      description:
        account.accountType === "SAVINGS"
          ? "Cuenta de Ahorros"
          : "Cuenta Corriente",
      date: new Date(account.createdAt),
    })),

    ...transactions.map((transaction) => ({
      type: transaction.type as
        | "TRANSFER"
        | "DEPOSIT"
        | "WITHDRAW",

      title:
        transaction.type === "TRANSFER"
          ? "Transferencia realizada"
          : transaction.type === "DEPOSIT"
          ? "Depósito realizado"
          : "Retiro realizado",

      description: `$${Number(transaction.amount).toLocaleString("es-CO")}`,

      date: new Date(transaction.transactionDate),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <main className="space-y-8">

      <DashboardHero />

      <section className="grid gap-6 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            accentClass={stat.accentClass}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">

        <ActivityCard activities={activities} />

        <QuickActions />

      </section>

      <Card
        title="Módulos principales"
        description="Accede rápidamente a cada módulo del sistema."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {moduleLinks.map((module) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              href={module.href}
              icon={module.icon}
            />
          ))}
        </div>
      </Card>

    </main>
  );
}