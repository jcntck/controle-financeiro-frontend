import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";

export type DataTableRow = {
  id: any;
  columns: string[];
};

export type DataTableItems = {
  headerColumns: string[];
  rows: DataTableRow[];
};

function DataTableRows({ rows }: { rows: DataTableRow[] }) {
  return rows.map((row) => (
    <TableRow key={row.id}>
      {row.columns.map((column, index) => {
        if (index == 0)
          return (
            <TableCell component="th" scope="row" key={index}>
              {column}
            </TableCell>
          );
        return <TableCell key={index}>{column}</TableCell>;
      })}
    </TableRow>
  ));
}

export default function DataTable({ items }: { items: DataTableItems }) {
  const { headerColumns, rows } = items;

  return (
    <Paper sx={{ width: "100%", scrollbarWidth: "10px" }}>
      <TableContainer sx={{ maxHeight: "800px" }}>
        <Table stickyHeader aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Situação</TableCell>
              <TableCell>Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DataTableRows rows={rows} />
          </TableBody>
          <TableFooter sx={{ position: "sticky", insetBlockEnd: 0, backgroundColor: "white" }}>
            <TableRow>
              <TableCell>Receitas</TableCell>
              <TableCell>R$ 700.00</TableCell>
              <TableCell>Despesas</TableCell>
              <TableCell>R$ 600.00</TableCell>
              <TableCell>Balanço</TableCell>
              <TableCell>R$ 100.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
