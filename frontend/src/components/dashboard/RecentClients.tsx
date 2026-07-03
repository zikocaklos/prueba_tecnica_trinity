"use client";

type Client = {
  id?: number;
  nombre?: string;
  documento?: string;
  email?: string;
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
            Clientes registrados recientemente
          </p>

        </div>

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

              clients.map((client, index) => (

                <tr
                  key={client.id ?? index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">

                        {(client.nombre ?? "?").charAt(0).toUpperCase()}

                      </div>

                      <span className="font-medium text-slate-900">
                        {client.nombre}
                      </span>

                    </div>

                  </td>

                  <td className="text-slate-600">
                    {client.documento}
                  </td>

                  <td className="text-slate-600">
                    {client.email}
                  </td>

                  <td className="text-right">

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Activo
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}