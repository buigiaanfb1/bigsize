/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./createInventoryNote.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Label } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  CREATE_INVENTORY_NOTE_FAIL,
  CREATE_INVENTORY_NOTE_REQUEST,
  CREATE_INVENTORY_NOTE_TRIGGER,
} from "../../../service/Validations/VarConstant";
import { DataGrid } from "@mui/x-data-grid";
import { Formik } from "formik";
import {
  createInventoryNoteAction,
  exportExcelAction,
} from "../../../redux/actions/inventoryAction";
import { SchemaErrorMessageCreateInventoryNote } from "../../../service/Validations/InventoryNoteValidation";
import Loading from "../../../components/Loading";

const formatDate = (date) => {
  const arrayDate = date.split("-");
  const newDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
  return newDate;
};

const formatToDate = (date) => {
  const arrayDate = date.split("/");
  const newDate = `${arrayDate[1]}/${arrayDate[0]}/${arrayDate[2]}`;
  return newDate;
};

const currentDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = mm + "/" + dd + "/" + yyyy;
  return formattedToday;
};

export default function CreateImportDeliver() {
  const apiRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [flagDisable, setDisable] = useState(false);
  const [flagSubmit, setSubmit] = useState(false);
  // console.log(rows);
  // const { apiRef, columns } = useApiRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const response = useSelector((state) => state.quantityAjustment);
  const createInventoryNote = useSelector((state) => state.createInventoryNote);
  // let { data, loading, list_products, error } = useSelector((state) => state.listInventoryProduct);

  const { loading } = createInventoryNote;

  console.log(createInventoryNote);
  // console.log(currentDate());
  // const { list_products } = data;

  useEffect(() => {
    if (createInventoryNote.error) {
      toast.error("Lấy danh sách kiểm kê thất bại");
      dispatch({ type: CREATE_INVENTORY_NOTE_FAIL, payload: false });
    }
  }, [dispatch, createInventoryNote.error]);

  const handleExportToExcel = (id) => {
    dispatch(exportExcelAction(id));
  };

  const onSubmit = (data) => {
    setSubmit(true);
    setDisable(true);
    dispatch(
      createInventoryNoteAction(data, formatDate(data.from_date), formatToDate(data.to_date))
    );
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Chưa có sản phẩm nào được chọn để kiểm kê
      </Stack>
    );
  }

  const handleReset = () => {
    // if (createInventoryNote.data) {
    //
    // }
    dispatch({ type: CREATE_INVENTORY_NOTE_TRIGGER });
    setDisable(false);
    setSubmit(false);
  };

  const columns = [
    {
      field: "product_detail_id",
      headerName: "Mã",
      flex: 0.3,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
    },
    {
      field: "product_name",
      headerName: "Sản phẩm",
      flex: 1.6,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.product_name}&thinsp; - &thinsp;{params.row.colour}&thinsp; - &thinsp;
          {params.row.size}
        </div>
      ),
    },
    {
      field: "beginning_quantity",
      headerName: "S.lượng đầu kì",
      flex: 0.7,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "ending_quantity",
      headerName: "S.lượng cuối kì",
      flex: 0.7,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "real_quantity",
      headerName: "S.lượng Sau khi điều chỉnh",
      flex: 1,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    // {
    //   field: "difference_quantity",
    //   headerName: "Chênh lệch",
    //   flex: 0.5,
    //   disableClickEventBubbling: true,
    //   sortable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => (
    //     <div>
    //       {params.row.difference_quantity < 0
    //         ? `Thiếu ${params.row.difference_quantity.toString().split("-")[1]}`
    //         : ""}
    //       {params.row.difference_quantity > 0 ? `Dư ${params.row.difference_quantity}` : ""}
    //       {params.row.difference_quantity === 0 ? `${params.row.difference_quantity}` : ""}
    //     </div>
    //   ),
    // },
    {
      field: "",
      width: 0,
      renderCell: (params) => {
        apiRef.current = params.api;
        return null;
      },
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="new-import">
        <div className="account">
          <div className="account-top">
            <div className="account-top">
              <Formik
                initialValues={{
                  inventory_note_name: "",
                  from_date: "",
                  to_date: currentDate(),
                }}
                onReset={handleReset}
                onSubmit={onSubmit}
                validationSchema={SchemaErrorMessageCreateInventoryNote}
                validateOnBlur
                validateOnChange
                handleReset
              >
                {(formik) => {
                  console.log(formik);
                  return (
                    <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                      <Form.Group className="top-add-product" widths="equal">
                        <Form.Input
                          name="inventory_note_name"
                          fluid
                          label="Tên đơn"
                          placeholder="Tên đơn kiểm kê"
                          type="text"
                          onChange={formik.handleChange}
                          value={formik.values.inventory_note_name}
                          readOnly={flagDisable}
                          error={
                            formik.touched.inventory_note_name && formik.errors.inventory_note_name
                              ? formik.errors.inventory_note_name
                              : null
                          }
                        />
                      </Form.Group>
                      <Form.Group className="top-add-product" widths="equal">
                        <Form.Input
                          name="from_date"
                          fluid
                          label="Từ ngày"
                          placeholder="Ngày"
                          type="date"
                          onChange={formik.handleChange}
                          value={formik.values.from_date}
                          readOnly={flagDisable}
                          error={
                            (formik.touched.from_date && formik.errors.from_date) ||
                            (formik.touched.to_date && formik.errors.to_date)
                              ? formik.errors.from_date || formik.errors.to_date
                              : null
                          }
                        />
                        <Form.Input
                          name="to_date"
                          fluid
                          label="Ngày hiện hành"
                          placeholder="Ngày"
                          type="input"
                          onChange={formik.handleChange}
                          value={formik.values.to_date}
                          // error={
                          //   formik.touched.to_date && formik.errors.to_date
                          //     ? formik.errors.to_date
                          //     : null
                          // }
                          readOnly
                        />
                      </Form.Group>
                      <div className="button-ui">
                        {loading === "end" && (
                          <>
                            <Form.Button
                              label="."
                              // className="choose-button-add-product"
                              type="button"
                              color="green"
                              onClick={() =>
                                handleExportToExcel(
                                  createInventoryNote.data.content.inventory_note_id
                                )
                              }
                            >
                              Xuất Excel
                            </Form.Button>
                            <Form.Button
                              label="."
                              // className="choose-button-add-product"
                              type="button"
                              color="green"
                              onClick={() =>
                                navigate(
                                  `/inventory/${createInventoryNote.data.content.inventory_note_id}`
                                )
                              }
                            >
                              Điều Chỉnh
                            </Form.Button>
                          </>
                        )}
                        {loading === "normal" && (
                          <Form.Button
                            label="."
                            className="choose-button-add-product"
                            type="submit"
                            color="green"
                          >
                            Tạo
                          </Form.Button>
                        )}
                        <Form.Button
                          label="."
                          className="button-add-product"
                          type="reset"
                          color="blue"
                          // onClick={}
                        >
                          Reset
                        </Form.Button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div>
              {loading === "normal" && ""}
              {loading === "loading" && <Loading />}
              {loading === "end" && (
                <div className="account-top-left">
                  <Box sx={{ width: "100%" }}>
                    <Stack direction="row" spacing={1}>
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
                        getRowId={(r) => r.product_detail_id}
                        rows={createInventoryNote.data.content.inventory_note_detail || []}
                        disableSelectionOnClick
                        columns={columns}
                        pageSize={10}
                        data={(query) =>
                          new Promise(() => {
                            console.log(query);
                          })
                        }
                        components={{
                          NoRowsOverlay,
                        }}
                      />
                    </Stack>
                  </Box>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}