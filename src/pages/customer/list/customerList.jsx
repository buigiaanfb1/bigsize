/* eslint-disable */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import "./customerList.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { listCustomer } from "../../../redux/actions/customerAction";

// import customerApi from "../../api/customerApi";
import Notification from "pages/components/dialog/Notification";
import ConfirmDialog from "pages/components/dialog/ConfirmDialog";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default function CustomerList() {
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  // const [paging, setPaging] = useState({});
  //Test
  const { data, error, loading } = useSelector((state) => state.customerList);
  const [page, setPage] = useState(1);
  const triggerReload = useSelector((state) => state.triggerReload);
  // const [keySearch, setKeySearch] = useState("");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  console.log(data);
  useEffect(() => {
    dispatch(listCustomer(searchText));
  }, [dispatch, page, searchText, triggerReload]);

  let inputSearchHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setSearchText(lowerCase);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
  }

  const handleClickSearch = (searchText) => {};

  function handleRowClick(rowData) {
    // console.log(rowData);
    // <div>
    //   <Route path={`/customer/:${rowData}`}>
    //     <Product />
    //   </Route>
    // </div>
    // <Link to={`/customer/:${rowData.customer_id}`}></Link>;
  }

  const handleDelete = (id) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    setNotify({
      isOpen: true,
      message: "Deleted Successfully",
      type: "success",
    });
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Không tìm thấy khách hàng nào
      </Stack>
    );
  }

  function NoResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Không tìm thấy khách hàng nào
      </Stack>
    );
  }

  const columns = [
    { field: "uid", headerName: "Mã", width: 150 },
    {
      field: "fullname",
      headerName: "Họ tên",
      width: 400,
      renderCell: (params) => <div className="customerListItem">{params.row.fullname}</div>,
    },
    {
      field: "username",
      headerName: "Tài khoản",
      width: 160,
      renderCell: (params) => <div>{params.row.username}</div>,
    },
    {
      field: "create_at",
      headerName: "Ngày tạo",
      width: 160,
      renderCell: (params) => <div>{params.row.create_at}</div>,
    },
    {
      field: "status",
      headerName: "Tình trạng",
      width: 120,
      renderCell: (params) => (
        <div>{params.row.status === "Active" ? "Hoạt động" : "Đóng cửa"}</div>
      ),
    },
    {
      field: "action",
      headerName: "Thao tác",
      width: 250,
      renderCell: (params) => (
        <>
          <Link to={`/customer/:${params.row.uid}`}>
            <button type="submit" className="customerListEdit">
              Edit
            </button>
          </Link>

          <Link to={`/customer/:${params.row.uid}`}>
            <button type="submit" className="customerListEdit">
              View
            </button>
          </Link>
          <Button
            className="customerListDelete"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                title: "Are you sure to delete this record?",
                subTitle: "Delete",
                onConfirm: () => {
                  handleDelete(params.row.uid);
                },
              })
            }
            color="red"
            icon="trash alternate"
          />
        </>
      ),
    },
  ];

  return (
    <div className="customerTab">
      <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment">Tìm kiếm khách hàng</InputLabel>
        <OutlinedInput
          id="outlined-adornment"
          value={searchText}
          onChange={inputSearchHandler}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickSearch}
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Tìm kiếm khách hàng"
        />
      </FormControl>
      <div className="customerList">
        <DataGrid
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "green",
            },
          }}
          loading={loading}
          getRowId={(r) => r.uid}
          rows={data}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          data={(query) =>
            new Promise(() => {
              console.log(query);
            })
          }
          onRowClick={(param) => (
            <>
              <Link to={`/customer/:${param.row.customer_id}`}></Link>
            </>
          )}
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay,
            NoResultsOverlay,
          }}
        />
      </div>
      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </div>
  );
}
