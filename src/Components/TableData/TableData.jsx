import React, { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


const columns = [
    { id: 'bank_name', label: 'Bank Name',align: 'center', },
    { id: 'ifsc', label: 'IFSC Code',align: 'center', },
    {
        id: 'branch',
        label: 'Branch',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'address',
        label: 'Address',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'city',
        label: 'City',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'district',
        label: 'District',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'state',
        label: 'State',
        minWidth: 170,
        align: 'center',
    },
];

const cities = [
    {
        value: 'Bangalore',
        label: 'Bangalore',
    },
    {
        value: 'Mumbai',
        label: 'Mumbai',
    },
    {
        value: 'Delhi',
        label: 'Delhi',
    },
    {
        value: 'Kolkata',
        label: 'Kolkata',
    },
    {
        value: 'Chennai',
        label: 'Chennai',
    },
];




export default function TableData() {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [city, setCity] = useState('');
    const [search, setsearch] = useState('')
    const [rows, setrows] = useState([])
    const [favourites,setFavourites]=useState([])
    const [value,setValue]=useState({})

    useEffect(() => {
        getAllData()
        throttled.current(search)
    },[search])
 
    const throttled = useRef(throttle((newValue) => console.log(newValue), 1000))

    const getAllData = () => {
        axios.get(`https://bankserver.herokuapp.com/api/branches?q=${search}`).then((res) => {
            setrows(res.data.results)
        })
    }



    const handleChange = (event) => {
        setsearch(event.target.value)
        setCity(event.target.value)
    };

    const handleSearch = (e)=>{
        setsearch(e.target.value)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleFavouritesBank=(event)=>{
        let index=event.target.name
        if(value[index]==undefined){
            setValue({...value,[index]:true})
        }
        else{
            let v=value[index]
            setValue({...value,[index]:!v})
        }
        
        favouriteList(index)
        
        
        
    }
    
    const favouriteList=(index)=>{
        
        if(!value[index]){
            setFavourites([...favourites,rows[index]])
        }
        else{
            favourites.splice(index,1)
            setFavourites(favourites)
        }

    }
    return (
        <Paper className={classes.root}>
            <div className={classes.searchBar} >
                <TextField
                    id="standard-select-currency"
                    select
                    label="Bank"
                    value={city}
                    onChange={handleChange}
                    variant="outlined"
                    helperText="Please select your bank city"
                >
                    {cities.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="standard-basic" onChange={handleSearch} label="Search" />

            </div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center' >
                                S.No.
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    className={classes.head}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row,index) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={index+1}>
                                    <TableCell key={index+1} align='center' >
                                        {index+1}
                                        <FormControlLabel
                                            control={<Checkbox icon={<FavoriteBorder />}  checkedIcon={<Favorite />}  />}
                                            onChange={handleFavouritesBank}
                                            key={index}
                                            name={index}

                                        />
                                    </TableCell>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    searchBar: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: 20
    },
    head:{
        fontWeight:'bold',
    }
});
