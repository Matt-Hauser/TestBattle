
// import React from 'react';
// import { makeStyles } from '@mui/styles';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';
// import Chip from '@mui/material/Chip';
// import LinearProgress from '@mui/material/LinearProgress';
// import ImageIcon from '@mui/icons-material/Image';

// interface PokemonType {
//   name: string;
//   url: string;
// }

// interface PokemonStat {
//   base_stat: number;
//   effort: number;
//   stat: {
//     name: string;
//     url: string;
//   };
// }

// interface PokemonProps {
//   name: string;
//   types: PokemonType[];
//   stats: PokemonStat[];
//   sprites: {
//     front_default: string;
//   };
// }

// const useStyles = makeStyles((theme) => ({
//   root: {
//     maxWidth: 300,
//     margin: theme.spacing(2),
//     textAlign: 'center',
//   },
//   sprite: {
//     maxHeight: 150,
//     maxWidth: '100%',
//   },
// }));

// const PokeCard: React.FC<PokemonProps> = ({ name, types, stats, sprites }) => {
//   const classes = useStyles();

//   return (
//     <Card className={classes.root}>
//       <CardContent>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12}>
//             <img src={sprites.front_default} alt={`${name} sprite`} className={classes.sprite} />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="h5" component="div">
//               {name}
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Types</Typography>
//             {types.map((type) => (
//               <Chip key={type.name} label={type.name} color="primary" />
//             ))}
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle1">Stats</Typography>
//             {stats.map((stat) => (
//               <div key={stat.stat.name}>
//                 <Typography variant="body1">{stat.stat.name}</Typography>
//                 <LinearProgress variant="determinate" value={stat.base_stat} />
//               </div>
//             ))}
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default PokeCard;
