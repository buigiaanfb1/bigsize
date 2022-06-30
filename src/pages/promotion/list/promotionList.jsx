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

import "./promotionList.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { listPromotion } from "../../../redux/actions/promotionAction";

// import promotionApi from "../../api/promotionApi";
import Notification from "pages/components/dialog/Notification";
import ConfirmDialog from "pages/components/dialog/ConfirmDialog";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default function PromotionList() {
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  // const [paging, setPaging] = useState({});
  //Test
  const { data, error, loading } = useSelector((state) => state.promotionList);
  const [page, setPage] = useState(1);
  const triggerReload = useSelector((state) => state.triggerReload);
  // const [keySearch, setKeySearch] = useState("");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  // console.log(data);
  useEffect(() => {
    dispatch(listPromotion(searchText));
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
    //   <Route path={`/promotion/:${rowData}`}>
    //     <Product />
    //   </Route>
    // </div>
    // <Link to={`/promotion/:${rowData.promotion_id}`}></Link>;
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
        Không tìm thấy khuyến mãi nào
      </Stack>
    );
  }

  function NoResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Không tìm thấy khuyến mãi nào
      </Stack>
    );
  }

  const columns = [
    { field: "promotion_id", headerName: "ID", width: 90 },
    {
      field: "promotion_name",
      headerName: "Tên mã khuyến mãi",
      width: 250,
      renderCell: (params) => <div className="promotionListItem">{params.row.promotion_name}</div>,
    },
    {
      field: "promotion_value",
      headerName: "Giá trị khuyến mãi (%)",
      width: 160,
      renderCell: (params) => <div>{params.row.promotion_value}</div>,
    },
    {
      field: "apply_date",
      headerName: "Ngày áp dụng",
      width: 160,
      renderCell: (params) => <div>{params.row.apply_date}</div>,
    },
    {
      field: "expired_date",
      headerName: "Ngày hết hạn",
      width: 160,
      renderCell: (params) => <div>{params.row.expired_date}</div>,
    },
    {
      field: "status",
      headerName: "Tình trạng",
      width: 120,
      renderCell: (params) => <div>{params.row.status ? "Đang áp dụng" : "Hết hạn"}</div>,
    },
    {
      field: "action",
      headerName: "Thao tác",
      width: 250,
      renderCell: (params) => (
        <>
          <Link to={`/promotion/:${params.row.promotion_id}`}>
            <button type="submit" className="promotionListEdit">
              Edit
            </button>
            <Link to={`/promotion/:${params.row.promotion_id}`}>
              <button type="submit" className="promotionListEdit">
                View
              </button>
            </Link>
          </Link>
          <Button
            className="promotionListDelete"
            onClick={() =>
              setConfirmDialog({
                isOpen: true,
                title: "Are you sure to delete this record?",
                subTitle: "Delete",
                onConfirm: () => {
                  handleDelete(params.row.id);
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
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment">Tìm kiếm khuyến mãi</InputLabel>
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
          label="Tìm kiếm khuyến mãi"
        />
      </FormControl>
      <Link to="/newpromotion">
        <button type="button" className="promotionAddButton">
          Tạo khuyến mãi mới
        </button>
      </Link>

      <div className="promotionList">
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
          getRowId={(r) => r.promotion_id}
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
              <Link to={`/promotion/:${param.row.promotion_id}`}></Link>
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