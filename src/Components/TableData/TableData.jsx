import React, { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from "@material-ui/core/Button";

const columns = [
  { id: "bank_name", label: "Bank Name", align: "center" },
  { id: "ifsc", label: "IFSC Code", align: "center" },
  {
    id: "branch",
    label: "Branch",
    minWidth: 170,
    align: "center",
  },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
    align: "center",
  },
  {
    id: "city",
    label: "City",
    minWidth: 170,
    align: "center",
  },
  {
    id: "district",
    label: "District",
    minWidth: 170,
    align: "center",
  },
  {
    id: "state",
    label: "State",
    minWidth: 170,
    align: "center",
  },
];

const cities = [
  {
    value: "Bangalore",
    label: "Bangalore",
  },
  {
    value: "Mumbai",
    label: "Mumbai",
  },
  {
    value: "Delhi",
    label: "Delhi",
  },
  {
    value: "Kolkata",
    label: "Kolkata",
  },
  {
    value: "Chennai",
    label: "Chennai",
  },
];

let fav = [];
let value={};
export default function TableData() {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [city, setCity] = useState("");
  const [search, setsearch] = useState("");
  const [rows, setrows] = useState([]);
  useEffect(() => {
    getAllData();
  }, [search]);

  const getAllData = () => {
    axios
      .get(`https://bankserver.herokuapp.com/api/branches?q=${search}`)
      .then((res) => {
        setrows(res.data.results);
      });
  };

  const handleChange = (event) => {
    setsearch(event.target.value);
    setCity(event.target.value);
  };

  const handleSearch = (e) => {
    setsearch(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleFavouritesBank = (e) => {
    if(value[e.target.name]==undefined){
        value[e.target.name]=true
    }
    else{
        value[e.target.name]=!value[e.target.name]
    }
    let favrows = rows.filter((obj) => {
      return obj.ifsc === e.target.name;
    });
    console.log(favrows);
    if (fav.some((obj) => obj.ifsc === favrows[0].ifsc)) {
      fav = fav.filter((obj) => {
        return obj.ifsc !== favrows[0].ifsc;
      });
    } else {
      fav.push(favrows[0]);
    }
    localStorage.setItem("favourites", JSON.stringify(fav));
    localStorage.setItem("checkboxvalue",JSON.stringify(value));

  };
  const showfavouritedBank = () => {
    let favouritesbank = localStorage.getItem("favourites");
    let checkboxbanks=localStorage.getItem("checkboxvalue");
    setrows(JSON.parse(favouritesbank));
    value=JSON.parse(checkboxbanks);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.searchBar}>
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
        <Button
          variant="contained"
          color="secondary"
          onClick={showfavouritedBank}
          endIcon={<Favorite/>}
        >
          Favourites bank
        </Button>
        <TextField id="standard-basic" onChange={handleSearch} label="Search" />
      </div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.head}>
                S.No.
              </TableCell>
              <TableCell align="center" className={classes.head}>
                Favourite
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
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index + 1}>
                    <TableCell key={index + 1} align="center">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={value[row["ifsc"]]}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                          />
                        }
                        onChange={handleFavouritesBank}
                        key={row["ifsc"]}
                        name={row["ifsc"]}
                      />
                    </TableCell>

                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
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
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  searchBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
    alignItems: 'baseline'
  },
  head: {
    fontWeight: "bold",
  },
});
