"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  UserPlus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Activity = {
  type: "CLIENT" | "ACCOUNT" | "DEPOSIT" | "WITHDRAW" | "TRANSFER";
  title: string;
  description: string;
  date: Date;
};

type Props = {
  activities: Activity[];
};

export function ActivityCard({ activities }: Props) {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "CLIENT":
        return {
          icon: UserPlus,
          color: "bg-blue-100 text-blue-600",
        };

      case "ACCOUNT":
        return {
          icon: Landmark,
          color: "bg-emerald-100 text-emerald-600",
        };

      case "TRANSFER":
        return {
          icon: ArrowUpRight,
          color: "bg-violet-100 text-violet-600",
        };

      case "DEPOSIT":
        return {
          icon: ArrowDownLeft,
          color: "bg-cyan-100 text-cyan-600",
        };

      case "WITHDRAW":
        return {
          icon: ArrowUpRight,
          color: "bg-amber-100 text-amber-600",
        };

      default:
        return {
          icon: Landmark,
          color: "bg-slate-100 text-slate-600",
        };
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-900">
            Actividad reciente
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimos movimientos registrados
          </p>

        </div>

      </div>

      <div className="mt-8 space-y-5">

        {activities.map((activity, index) => {

          const { icon: Icon, color } = getIcon(activity.type);

          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>

                  <p className="font-semibold text-slate-900">
                    {activity.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {activity.description}
                  </p>

                </div>

              </div>

              <span className="text-sm text-slate-400">
                {formatDistanceToNow(activity.date, {
                  addSuffix: true,
                  locale: es,
                })}
              </span>

            </div>
          );
        })}

      </div>
    </section>
  );
}