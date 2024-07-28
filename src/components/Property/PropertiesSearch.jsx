import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Box, Stack, Paper, Button, ThemeProvider, Grid, Container, InputBase, IconButton, Avatar, Badge } from "@mui/material";
import theme from "../../theme/theme";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import propertyImage from "./propertyImage.png";
import maintenanceIcon from "./maintenanceIcon.png";
import { useUser } from "../../contexts/UserContext";
import { get } from "../utils/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import APIConfig from "../../utils/APIConfig";
import PropertyDetail from "./PropertyDetail";
import PropertyDetail2 from "./PropertyDetail2";
// import PMRent from "../Rent/PMRent/PMRent";
import PropertyForm from "../Property/PropertyForm";

function PropertiesSearch({ propertyList, setFilteredItems}) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
      const query = event.target.value;
      setSearchTerm(query);
      if (query.trim() === "") {
        setFilteredItems(propertyList); // Reset to the original list if the search bar is cleared
      } else {
        const terms = query.split(" ").map((term) => term.toLowerCase()); // Split the search term into individual terms
        const filtered = propertyList.filter((item) =>
          terms.every((term) => (item.property_address + item.property_unit + item.property_city + item.property_state + item.property_zip).toLowerCase().includes(term))
        );
        setFilteredItems(filtered); // Updating the state with filtered items
      }
    };

    const clearSearch = () => {
      setSearchTerm("");
      setFilteredItems(propertyList);
    };

    return (
      <Paper
        component='form'
        sx={{
          p: "2px 4px",
          alignItems: "center",
          backgroundColor: theme.palette.form.main,
          display: "flex",
        }}
      >
        <IconButton type='submit' sx={{ p: "10px" }} aria-label='search'>
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, zIndex: 1000, flexGrow: 1 }}
          placeholder='Search...'
          inputProps={{ "aria-label": "search" }}
          value={searchTerm}
          onChange={handleSearchChange}
          color={theme.typography.common.blue}
        />
        {searchTerm && (
          <IconButton aria-label='clear' onClick={clearSearch}>
            <CloseIcon />
          </IconButton>
        )}
      </Paper>
    );
  };

export default PropertiesSearch;
