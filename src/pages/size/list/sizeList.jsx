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

import "./sizeList.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { listSize } from "../../../redux/actions/sizeAction";

// import sizeApi from "../../api/sizeApi";
import Notification from "pages/components/dialog/Notification";
import ConfirmDialog from "pages/components/dialog/ConfirmDialog";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default function SizeList() {
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  // const [paging, setPaging] = useState({});
  //Test
  const { size, error, loading } = useSelector((state) => state.sizeList);
  const [page, setPage] = useState(1);
  const triggerReload = useSelector((state) => state.triggerReload);
  // const [keySearch, setKeySearch] = useState("");
  const dispatch = useDispatch();
  const [keySearch, setSearchText] = useState("");

  useEffect(() => {
    dispatch(listSize({ keySearch }));
  }, [dispatch, page, keySearch, triggerReload]);

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

  const handleClickSearch = (keySearch) => {};

  function handleRowClick(rowData) {
    // console.log(rowData);
    // <div>
    //   <Route path={`/size/:${rowData}`}>
    //     <Product />
    //   </Route>
    // </div>
    // <Link to={`/size/:${rowData.size_id}`}></Link>;
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
        Không tìm thấy kích cỡ nào
      </Stack>
    );
  }

  function NoResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Không tìm thấy kích cỡ nào
      </Stack>
    );
  }

  const columns = [
    { field: "size_id", headerName: "ID", width: 90 },
    {
      field: "size_name",
      headerName: "Size",
      width: 200,
      renderCell: (params) => <div className="sizeListItem">{params.row.size_name}</div>,
    },
    // {
    //   field: "status",
    //   headerName: "Tình trạng",
    //   width: 120,
    // },
    {
      field: "action",
      headerName: "Thao tác",
      width: 250,
      renderCell: (params) => (
        <>
          <Link to={`/update-size/${params.row.size_id}`}>
            <button type="submit" className="sizeListEdit">
              Chỉnh sửa
            </button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment">Tìm kiếm kích cỡ</InputLabel>
        <OutlinedInput
          id="outlined-adornment"
          value={keySearch}
          onChange={inputSearchHandler}
          label="Tìm kiếm kích cỡ"
        />
      </FormControl>
      <Link to="/newSize">
        <button type="button" className="sizeAddButton">
          Tạo kích cỡ mới
        </button>
      </Link>

      <div className="sizeList">
        <DataGrid
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "green",
            },
          }}
          autoHeight
          loading={loading}
          getRowId={(r) => r.size_id}
          rows={size}
          disableSelectionOnClick
          columns={columns}
          pageSize={10}
          data={(query) =>
            new Promise(() => {
              console.log(query);
            })
          }
          onRowClick={(param) => (
            <>
              <Link to={`/size/:${param.row.size_id}`}></Link>
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
    </DashboardLayout>
  );
}
