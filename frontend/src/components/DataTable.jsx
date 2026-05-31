function DataTable({

  columns,
  data,

  loading,

  emptyMessage = "No data found",

  renderRow

}) {

  return (

    <div className="

      overflow-x-auto

      rounded-[34px]

      border
      border-zinc-800

      bg-black/60

      backdrop-blur-lg

    ">

      <table className="w-full">

        {/* HEADER */}

        <thead>

          <tr className="

            border-b
            border-zinc-800

            bg-zinc-900/70

          ">

            {

              columns.map((column) => (

                <th

                  key={column}

                  className="

                    text-left

                    p-6

                    text-[20px]
                    font-bold

                    whitespace-nowrap

                  "

                >

                  {column}

                </th>

              ))

            }

          </tr>

        </thead>

        {/* BODY */}

        <tbody>

          {

            loading ? (

              <tr>

                <td

                  colSpan={columns.length}

                  className="

                    text-center

                    py-24

                    text-zinc-400
                    text-xl

                  "

                >

                  Loading...

                </td>

              </tr>

            )

            : data.length === 0 ? (

              <tr>

                <td

                  colSpan={columns.length}

                  className="

                    text-center

                    py-24

                    text-zinc-500
                    text-2xl

                  "

                >

                  {emptyMessage}

                </td>

              </tr>

            )

            : (

              data.map(renderRow)

            )

          }

        </tbody>

      </table>

    </div>

  );

}

export default DataTable;