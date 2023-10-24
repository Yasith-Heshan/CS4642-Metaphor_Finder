import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function MetaphorTable({rows}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Metaphors in a poem line</TableCell>
            <TableCell align="right">Domain</TableCell>
            <TableCell align="right">Mood</TableCell>
            <TableCell align="right">Sinhala Meaning</TableCell>
            <TableCell align="right">English Meaning</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.metaphorical_terms}
              </TableCell>
              <TableCell align="right">{row.domain}</TableCell>
              <TableCell align="right">{row.mood}</TableCell>
              <TableCell align="right">{row.sinhala_meaning}</TableCell>
              <TableCell align="right">{row.english_meaning}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}