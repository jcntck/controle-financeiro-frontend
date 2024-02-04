import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';

export type DataTableRow = {
  id: any;
  columns: string[];
};

export type DataTableFooter = {
  label: string;
  colspan: number;
};

export type DataTableItems = {
  headerColumns: string[];
  rows: DataTableRow[];
  footerTable?: DataTableFooter[];
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
  const { headerColumns, rows, footerTable } = items;

  return (
    <Paper sx={{ width: '100%', scrollbarWidth: '10px' }}>
      <TableContainer sx={{ maxHeight: '85vh' }}>
        <Table stickyHeader aria-label="transaction table">
          <TableHead>
            <TableRow>
              {headerColumns.map((title, index) => (
                <TableCell key={index}>{title}</TableCell>
              ))}
              <TableCell>Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <DataTableRows rows={rows} />
          </TableBody>
          <TableFooter
            sx={{
              position: 'sticky',
              insetBlockEnd: 0,
              backgroundColor: 'white',
            }}
          >
            <TableRow>
              {footerTable &&
                footerTable.map((cell, index) => (
                  <TableCell colSpan={cell.colspan} key={index}>
                    {cell.label}
                  </TableCell>
                ))}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}

