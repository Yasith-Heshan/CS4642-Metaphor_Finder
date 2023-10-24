import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";
import MetaphorTable from "./MetaphorTable";

export default function PoemCard({poem}) {

    const tableRows = []

    poem.metaphorical_terms.forEach(
        (metaphor,index)=>{

            tableRows.push(
                {
                    metaphorical_terms:metaphor,
                    domain: poem.domain[index],
                    mood: poem.mood[index],
                    sinhala_meaning: poem.sinhala_meaning[index],
                    english_meaning: poem.english_meaning[index],
                }
            )
        }
    )

  return (
    <Box sx={{ width:'100%',}} pb={3} >
      <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" component="div">
                {poem.poem_name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {poem.poet}
              </Typography>
                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Year: {poem.year}
              </Typography>
                <Typography variant={'h6'} sx={{mb:1}}>උදාහරහණය:</Typography>
            <Grid
               container
               direction="row"
               justifyContent="center"
               alignItems="flex-start"
               p={3}
               spacing={5}
           >
                <Grid item xs={12} md={4}>

                {
                    poem.poem.map(
                        (line,index)=>{
                            return (
                            <Typography key={index} variant="body2">
                                {line}
                            </Typography>
                            );
                        }
                    )
                }
                </Grid>
                <Grid item xs={12} md={8}>
                <MetaphorTable rows={tableRows}/>
                </Grid>
            </Grid>
            </CardContent>
      </Card>
    </Box>
  );
}