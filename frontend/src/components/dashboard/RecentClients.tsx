"use client";

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  identificationType: string;
  email: string;
  deleted?: boolean;
};

type Props = {
  clients: Client[];
};

export function RecentClients({ clients }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Últimos clientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Clientes registrados en la base de datos
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {clients.length} clientes
        </span>

      </div>

      <div className="mt-8 overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="pb-4 text-left text-xs uppercase tracking-wider text-slate-500">
                Cliente
              </th>

              <th className="pb-4 text-left text-xs uppercase tracking-wider text-slate-500">
                Documento
              </th>

              <th className="pb-4 text-left text-xs uppercase tracking-wider text-slate-500">
                Correo
              </th>

              <th className="pb-4 text-right text-xs uppercase tracking-wider text-slate-500">
                Estado
              </th>

            </tr>

          </thead>

          <tbody>

            {clients.length === 0 ? (

              <tr>

                <td
                  colSpan={4}
                  className="py-10 text-center text-slate-400"
                >
                  No existen clientes registrados.
                </td>

              </tr>

            ) : (

              clients.map((client) => {

                const initials =
                  `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`;

                return (

                  <tr
                    key={client.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">

                          {initials.toUpperCase()}

                        </div>

                        <div>

                          <p className="font-semibold text-slate-900">
                            {client.firstName} {client.lastName}
                          </p>

                          <p className="text-sm text-slate-500">
                            {client.identificationType}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="text-slate-600">
                      {client.identificationNumber}
                    </td>

                    <td className="text-slate-600">
                      {client.email}
                    </td>

                    <td className="text-right">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          client.deleted
                            ? "bg-red-100 text-red-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {client.deleted ? "Inactivo" : "Activo"}
                      </span>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}