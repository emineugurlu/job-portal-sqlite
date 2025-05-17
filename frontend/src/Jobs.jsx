import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, CardActions,
  Typography, Button, TextField, Select, MenuItem
} from '@mui/material';

export default function Jobs({ token, onEdit }) {
  const [jobsData, setJobsData]     = useState({ jobs: [], page: 1, pages: 1, total: 0 });
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('createdAt');
  const [order, setOrder]           = useState('desc');
  const [limit, setLimit]           = useState(10);
  const [cats, setCats]             = useState([]);
  const [filterCat, setFilterCat]   = useState('');

  // fetchCats & fetchJobs aynen önceki gibi...

  // render
  return (
    <>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Ara..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Select
            fullWidth
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <MenuItem value="createdAt">Tarih</MenuItem>
            <MenuItem value="salary">Maaş</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Select
            fullWidth
            value={order}
            onChange={e => setOrder(e.target.value)}
          >
            <MenuItem value="desc">Azalan</MenuItem>
            <MenuItem value="asc">Artan</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Select
            fullWidth
            value={limit}
            onChange={e => setLimit(e.target.value)}
          >
            {[5,10,20].map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {jobsData.jobs.map(job => (
          <Grid item xs={12} md={6} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="text.secondary">
                  {job.company} — {job.location}
                </Typography>
                <Typography variant="body2" sx={{ mt:1 }}>
                  {job.description.slice(0,100)}…
                </Typography>
                <Typography variant="subtitle2" sx={{ mt:1 }}>
                  Maaş: {job.salary || 'Belirtilmemiş'}
                </Typography>
              </CardContent>
              <CardActions>
                {token && <Button size="small" onClick={()=>onEdit(job.id)}>Düzenle</Button>}
                <Button size="small" href={`/jobs/${job.id}`}>Detay</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination butonları da MUI Button’a çevrilebilir */}
    </>
  );
}
