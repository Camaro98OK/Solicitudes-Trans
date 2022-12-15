import { INAvbarData } from './helper';
export const navbarData: INAvbarData[] = [
{
    routelink: 'dashboard',
    icon: 'fa fa-home',
    label: 'Dashboard',
    items: []
},
{
  routelink: 'adminSIER',
  icon: 'fa-solid fa-gears' ,
  label: 'Administración SIER',
  items: []
},
{
  routelink: 'indiSIER',
  icon: 'fa-solid fa-puzzle-piece' ,
  label: 'Indicadores',
  items: [
          {
            routelink: 'indiSIER/PMCI01',
            label: 'Indicadores PMCI01',
          },
          {
            routelink: 'indiSIER/PMCI02',
            label: 'Indicadores PMCI02',
            },
          ]
},
{
  routelink: 'retrasosSIER',
  icon: 'fa-solid fa-person-walking-dashed-line-arrow-right' ,
  label: 'Atrasos',
  items: [
              {
                routelink: 'retrasosSIER/datos',
                label: 'Datos',
                items: [
                  {
                    routelink: 'retrasosSIER/datos2022',
                    label: 'Datos 2022',
                  },
                  {
                    routelink: 'retrasosSIER/datos2021',
                    label: 'Datos 2021',
                    items: [
                      {
                        routelink: 'retrasosSIER/datos2021Ene',
                        label: 'Enero 2021',
                      },
                      {
                        routelink: 'retrasosSIER/datos2021Feb',
                        label: 'Febrero 2021',
                      },

                    ]
                  },
                ]
              },
              {
                routelink: 'retrasosSIER/datos2',
                label: 'Datos2',
              },
            ]
},
{
  routelink: 'retrasosSIER',
  icon: 'fa-solid fa-person-walking-dashed-line-arrow-right' ,
  label: 'CMI',
  items: [
          {
          routelink: 'retrasosSIER/datos',
          label: 'Datos',
          items: []
          },
        ]
},
];
