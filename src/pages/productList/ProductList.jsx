/* eslint-disable */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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

import "./productList.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { listProduct, deleteProduct } from "../../redux/actions/productAction";

// import productApi from "../../api/productApi";
import ConfirmDialog from "pages/components/dialog/ConfirmDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { DELETE_PRODUCT_FAIL, DELETE_PRODUCT_SUCCESS } from "../../service/Validations/VarConstant";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default function ProductList() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const { role } = currentUser;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  const triggerReload = useSelector((state) => state.triggerReload);
  const deleteState = useSelector((state) => state.deleteProductState);
  const { data, error, loading, totalCount } = useSelector((state) => state.productList);
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: 10,
  });

  console.log(data);

  useEffect(() => {
    dispatch(listProduct(searchText, pageState.page, pageState.pageSize));
    if (deleteState.success) {
      toast.success("Thao t??c th??nh c??ng");
      dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: false });
    } else {
      // console.log(`create:${success}`);
    }
    if (deleteState.error) {
      // console.log(error);
      toast.error("Thao t??c th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: DELETE_PRODUCT_FAIL, payload: false });
    }
  }, [
    dispatch,
    pageState.page,
    pageState.pageSize,
    searchText,
    triggerReload,
    deleteState.success,
    deleteState.error,
  ]);

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

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Kh??ng t??m th???y s???n ph???m n??o
      </Stack>
    );
  }

  function NoResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Kh??ng t??m th???y s???n ph???m n??o
      </Stack>
    );
  }

  const columns = [
    { field: "product_id", headerName: "ID", width: 20 },
    {
      field: "product_name",
      headerName: "S???n ph???m",
      width: 290,
      renderCell: (params) => (
        <div className="productListItem">
          <img
            className="productListImg"
            src={params.row.image_url}
            alt={params.row.product_name}
          />
          {params.row.product_name}
        </div>
      ),
    },

    {
      field: "price",
      headerName: "Gi?? b??n (VN??)",
      width: 130,
      renderCell: (params) => <div>{params.row.price.toLocaleString("vi-VN")} </div>,
    },
    {
      field: "promotion_price",
      headerName: "Gi?? ??p d???ng khuy???n m??i (VN??)",
      width: 210,
      renderCell: (params) => (
        <div>
          {params.row.promotion_price
            ? `${params.row.promotion_price.toLocaleString("vi-VN")}`
            : "Hi???n ch??a ??p d???ng"}
        </div>
      ),
    },
    {
      field: "promotion_value",
      headerName: "Gi?? tr??? khuy???n m??i (%)",
      width: 160,
      renderCell: (params) => (
        <div>{params.row.promotion_value ? `${params.row.promotion_value}` : "Ch??a ??p d???ng"}</div>
      ),
    },

    {
      field: "status",
      headerName: "T??nh tr???ng",
      width: 120,
      renderCell: (params) => <div>{params.row.status ? "??ang b??n" : "Ngh?? b??n"}</div>,
    },

    {
      field: "action",
      headerName: "Thao t??c",
      width: 230,
      renderCell: (params) => (
        <>
          <IconButton
            size="large"
            color="secondary"
            type="submit"
            onClick={() => navigate(`/product/${params.row.product_id}`)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="large"
            color="secondary"
            type="submit"
            onClick={() => navigate(`/feedback/${params.row.product_id}`)}
          >
            <RateReviewIcon />
          </IconButton>
          {role === "Admin" ? (
            <Link to={`/update-product/${params.row.product_id}`}>
              <button type="submit" className="productListEdit">
                Edit
              </button>
            </Link>
          ) : (
            <></>
          )}
          {role === "Admin" ? (
            params.row.status ? (
              <Button
                className="productListDelete"
                onClick={() =>
                  setConfirmDialog({
                    isOpen: true,
                    title: "B???n mu???n ng???ng b??n s???n ph???m n??y?",
                    subTitle: "B???n ch???c ch????",
                    onConfirm: () => {
                      handleDelete(params.row.product_id);
                    },
                  })
                }
                color="red"
                icon="trash alternate"
              />
            ) : (
              <Button
                className="productListDelete"
                onClick={() =>
                  setConfirmDialog({
                    isOpen: true,
                    title: "B???n mu???n kh??i ph???c s???n ph???m n??y?",
                    subTitle: "B???n ch???c ch????",
                    onConfirm: () => {
                      handleDelete(params.row.product_id);
                    },
                  })
                }
                color="green"
                icon="undo"
              />
            )
          ) : (
            <></>
          )}
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment">T??m ki???m t??n s???n ph???m</InputLabel>
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
          label="T??m ki???m t??n s???n ph???m"
        />
      </FormControl>
      {role === "Admin" ? (
        <Link to="/newproduct">
          <button type="button" className="productAddButton">
            T???o s???n ph???m
          </button>
        </Link>
      ) : (
        <></>
      )}
      <div className="productList">
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
          getRowId={(r) => r.product_id}
          rows={data}
          rowCount={totalCount}
          rowsPerPageOptions={[10, 20, 50, 100]}
          pagination
          page={pageState.page - 1}
          paginationMode="server"
          onPageChange={(newPage) => setPageState((old) => ({ ...old, page: newPage + 1 }))}
          onPageSizeChange={(newPageSize) =>
            setPageState((old) => ({ ...old, pageSize: newPageSize }))
          }
          disableSelectionOnClick
          columns={columns}
          pageSize={pageState.pageSize}
          data={(query) =>
            new Promise(() => {
              console.log(query);
            })
          }
          components={{
            Toolbar: CustomToolbar,
            NoRowsOverlay,
            NoResultsOverlay,
          }}
        />
      </div>

      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </DashboardLayout>
  );
}
