/* eslint-disable */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
import { deletePromotion, listPromotion } from "../../../redux/actions/promotionAction";

// import promotionApi from "../../api/promotionApi";
import ConfirmDialog from "pages/components/dialog/ConfirmDialog";
import {
  DELETE_PROMOTION_FAIL,
  DELETE_PROMOTION_SUCCESS,
} from "../../../service/Validations/VarConstant";

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default function PromotionList() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  // const [paging, setPaging] = useState({});
  //Test
  const { data, error, loading, totalCount } = useSelector((state) => state.promotionList);
  const { success, loadingDelete, errorDelete } = useSelector(
    (state) => state.deletePromotionState
  );
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: 10,
  });
  const triggerReload = useSelector((state) => state.triggerReload);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keySearch, setSearchText] = useState("");
  useEffect(() => {
    dispatch(listPromotion({ keySearch }, pageState.page, pageState.pageSize));
    if (success) {
      toast.success("Thao t??c th??nh c??ng");
      dispatch({ type: DELETE_PROMOTION_SUCCESS, payload: false });
    } else {
      // console.log(`create:${success}`);
    }
    if (errorDelete) {
      // console.log(error);
      toast.error("Thao t??c th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: DELETE_PROMOTION_FAIL, payload: false });
    }
  }, [
    dispatch,
    pageState.page,
    pageState.pageSize,
    keySearch,
    triggerReload,
    success,
    errorDelete,
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
    dispatch(deletePromotion(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Kh??ng t??m th???y khuy???n m??i n??o
      </Stack>
    );
  }

  function NoResultsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Kh??ng t??m th???y khuy???n m??i n??o
      </Stack>
    );
  }

  const columns = [
    { field: "promotion_id", headerName: "ID", width: 90 },
    {
      field: "promotion_name",
      headerName: "T??n m?? khuy???n m??i",
      width: 350,
      renderCell: (params) => <div className="promotionListItem">{params.row.promotion_name}</div>,
    },
    {
      field: "promotion_value",
      headerName: "Gi?? tr??? khuy???n m??i (%)",
      width: 150,
      renderCell: (params) => <div>{params.row.promotion_value}</div>,
    },
    {
      field: "apply_date",
      headerName: "Ng??y ??p d???ng",
      width: 100,
      renderCell: (params) => <div>{params.row.apply_date}</div>,
    },
    {
      field: "expired_date",
      headerName: "Ng??y h???t h???n",
      width: 100,
      renderCell: (params) => <div>{params.row.expired_date}</div>,
    },
    {
      field: "status",
      headerName: "T??nh tr???ng",
      width: 120,
      renderCell: (params) => <div>{params.row.status ? "??ang ??p d???ng" : "H???t h???n"}</div>,
    },
    {
      field: "action",
      headerName: "Thao t??c",
      width: 330,
      renderCell: (params) => (
        <>
          <IconButton
            size="large"
            color="secondary"
            type="submit"
            onClick={() => navigate(`/promotion/${params.row.promotion_id}`)}
          >
            <VisibilityIcon />
          </IconButton>
          <Link to={`/update-promotion/${params.row.promotion_id}`}>
            <button type="submit" className="promotionListEdit">
              S???a
            </button>
          </Link>
          <Link to={`/products-in-promotion/${params.row.promotion_id}`}>
            <button type="submit" className="promotionListEdit">
              S???n ph???m ??p d???ng
            </button>
          </Link>
          {params.row.status ? (
            <Button
              className="promotionListDelete"
              onClick={() =>
                setConfirmDialog({
                  isOpen: true,
                  title: "B???n c?? mu???n v?? hi???u h??a khuy???n m???i n??y Big size kh??ng?",
                  subTitle: "Ch???c ch??a? Suy ngh?? cho k???",
                  onConfirm: () => {
                    handleDelete(params.row.promotion_id);
                  },
                })
              }
              color="red"
              icon="trash alternate"
            />
          ) : (
            <Button
              className="promotionListDelete"
              onClick={() =>
                setConfirmDialog({
                  isOpen: true,
                  title: "B???n c?? mu???n kh??i ph???c khuy???n m???i n??y?",
                  subTitle: "Kh??i ph???c",
                  onConfirm: () => {
                    handleDelete(params.row.promotion_id);
                  },
                })
              }
              color="green"
              icon="undo"
            />
          )}
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <FormControl sx={{ m: 1, width: "35ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment">T??m ki???m khuy???n m??i</InputLabel>
        <OutlinedInput
          id="outlined-adornment"
          value={keySearch}
          onChange={inputSearchHandler}
          label="T??m ki???m khuy???n m??i"
        />
      </FormControl>
      <Link to="/newPromotion">
        <button type="button" className="promotionAddButton">
          T???o khuy???n m??i m???i
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
          autoHeight
          loading={loading}
          getRowId={(r) => r.promotion_id}
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
