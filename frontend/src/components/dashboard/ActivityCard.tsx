import {
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  Landmark,
} from "lucide-react";

const activities = [
  {
    icon: UserPlus,
    title: "Nuevo cliente registrado",
    description: "María Rodríguez",
    time: "Hace 5 min",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Landmark,
    title: "Cuenta creada",
    description: "Cuenta de ahorro",
    time: "Hace 12 min",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: ArrowUpRight,
    title: "Transferencia enviada",
    description: "$1.250.000",
    time: "Hace 18 min",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: ArrowDownLeft,
    title: "Retiro realizado",
    description: "$350.000",
    time: "Hace 30 min",
    color: "bg-amber-100 text-amber-600",
  },
];

export function ActivityCard() {
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

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Hoy
        </span>

      </div>

      <div className="mt-8 space-y-5">

        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="group flex items-center justify-between rounded-2xl p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activity.color}`}
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
                {activity.time}
              </span>

            </div>
          );
        })}

      </div>
    </section>
  );
}