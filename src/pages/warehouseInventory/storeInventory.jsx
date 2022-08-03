/* eslint-disable */
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useDispatch, useSelector } from "react-redux";
import "./storeInventory.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Label } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";
import { useParams, useNavigate } from "react-router-dom";

import {
  QUANTITY_ADJUSTMENT_INVENTORY_SUCCESS,
  QUANTITY_ADJUSTMENT_INVENTORY_FAIL,
  GET_INVENTORY_PRODUCT_LIST_FAIL,
  GET_INVENTORY_PRODUCT_LIST_SUCCESS,
  QUANTITY_ADJUSTMENT_TRIGGER_SUCCESS_NOTIFICATION,
} from "../../service/Validations/VarConstant";
import { DataGrid } from "@mui/x-data-grid";
import { Formik } from "formik";
import { getProductToImportAction } from "../../redux/actions/productAction";
import { getInventoryAction, quantityAdjusmentAction } from "../../redux/actions/inventoryAction";
import { SchemaErrorMessageCheckInventory } from "../../service/Validations/InventoryValidation";
import Loading from "../../components/Loading";
let idCounter = 0;
const createRow = ({ product_id, product_name, real_quantity, product_detail_id }) => {
  idCounter += 1;
  return {
    id: idCounter,
    product_name: product_name,
    real_quantity: real_quantity,
    product_id: product_id,
    product_detail_id: product_detail_id,
  };
};

export default function CreateImportDeliver() {
  const apiRef = useRef(null);
  const [rows, setRows] = useState([]);
  // console.log(rows);
  // const { apiRef, columns } = useApiRef();
  const { inventoryNoteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listImportPro = useSelector((state) => state.listImportProduct);
  const response = useSelector((state) => state.quantityAjustment);
  let { data, loading, list_products, error } = useSelector((state) => state.listInventoryProduct);

  console.log(data);
  console.log(inventoryNoteId);
  console.log(response);
  // console.log(currentDate());
  // const { list_products } = data;

  // console.log(data);
  // console.log(loading);
  // console.log(list_products);

  // const { success, error } = response;

  useEffect(() => {
    dispatch(getProductToImportAction());
    dispatch({ type: GET_INVENTORY_PRODUCT_LIST_SUCCESS, payload: "" });
    dispatch({ type: QUANTITY_ADJUSTMENT_INVENTORY_SUCCESS, payload: "" });
    dispatch({ type: QUANTITY_ADJUSTMENT_TRIGGER_SUCCESS_NOTIFICATION, payload: false });
  }, [dispatch]);

  useEffect(() => {
    if (typeof error === "string" && error.includes("Trùng sản phẩm")) {
      toast.error("Kiểm tra kho thất bại, vui lòng không chọn trùng sản phẩm");
      dispatch({ type: GET_INVENTORY_PRODUCT_LIST_FAIL, payload: false });
    } else if (error) {
      toast.error("Kiểm tra kho thất bại, vui lòng thử lại");
      dispatch({ type: GET_INVENTORY_PRODUCT_LIST_FAIL, payload: false });
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (response.success) {
      toast.success("Điều chỉnh số lượng trong kho thành công");
      dispatch({ type: QUANTITY_ADJUSTMENT_TRIGGER_SUCCESS_NOTIFICATION, payload: false });
    }
    if (response.error) {
      toast.error("Điều chỉnh số lượng trong kho thất bại, vui lòng thử lại");
      dispatch({ type: QUANTITY_ADJUSTMENT_INVENTORY_FAIL, payload: false });
    }
  }, [response.error, dispatch, response.success]);

  //

  const onSubmit = (data) => {
    setRows((prevRows) => [...prevRows, createRow(data)]);
  };

  const handleClickButton = () => {
    if (apiRef.current) {
      const data = apiRef.current.getRowModels();
      if (data.size > 0) {
        dispatch(getInventoryAction(data, parseInt(inventoryNoteId)));
      } else {
        toast.error("Vui lòng chọn sản phẩm để kiểm kê số lượng");
      }
    } else {
      toast.error("Vui lòng chọn sản phẩm để kiểm kê số lượng");
    }
  };

  const handleClickAdjusment = () => {
    if (apiRef.current) {
      const data = apiRef.current.getRowModels();
      dispatch(quantityAdjusmentAction(data, inventoryNoteId));
    } else {
      toast.error("Cập nhật số lượng sản phẩm thất bại, vui lòng thử lại sau");
    }
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Chưa có sản phẩm nào được chọn để kiểm kê
      </Stack>
    );
  }

  const handleReset = () => {
    apiRef.current = null;
    if (data) {
      dispatch({ type: GET_INVENTORY_PRODUCT_LIST_SUCCESS, payload: "" });
      dispatch({ type: QUANTITY_ADJUSTMENT_INVENTORY_SUCCESS, payload: "" });
      dispatch({ type: QUANTITY_ADJUSTMENT_TRIGGER_SUCCESS_NOTIFICATION, payload: false });
    }
    if (rows) {
      setRows([]);
    }
  };

  const columns = [
    {
      field: "product_name",
      headerName: "Sản phẩm",
      flex: 1.0,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
    },
    {
      field: "beginning_quantity",
      headerName: "S.lượng đầu kì",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "ending_quantity_in_system",
      headerName: "S.lượng cuối kì",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "real_quantity",
      headerName: "S.lượng Thực Tế",
      flex: 0.6,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "difference_quantity",
      headerName: "Chênh lệch",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          {params.row.difference_quantity < 0
            ? `Thiếu ${params.row.difference_quantity.toString().split("-")[1]}`
            : ""}
          {params.row.difference_quantity > 0 ? `Dư ${params.row.difference_quantity}` : ""}
          {params.row.difference_quantity === 0 ? `${params.row.difference_quantity}` : ""}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Thao tác",
      flex: 0.4,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div>
          {list_products && list_products.length > 0 ? (
            ""
          ) : (
            <button
              onClick={() => {
                setRows(rows.filter((e) => e.id !== params.row.id));
              }}
            >
              <ClearIcon />
            </button>
          )}
        </div>
      ),
    },
    {
      field: "",
      flex: 0.1,
      renderCell: (params) => {
        console.log(params);
        apiRef.current = params.api;
        return null;
      },
    },
  ];

  const columns_after_adjust = [
    {
      field: "product_name",
      headerName: "Sản phẩm",
      flex: 1.0,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
      renderCell: (params) => (
        <div>{`${params.row.product_name} - ${params.row.colour_name}- ${params.row.size_name}`}</div>
      ),
    },
    {
      field: "beginning_quantity",
      headerName: "S.lượng đầu kì",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "ending_quantity_in_system",
      headerName: "S.lượng cuối kì",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "ending_quantity_after_adjusted",
      headerName: "S.lượng Sau Điều Chỉnh",
      flex: 0.6,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "",
      flex: 0.1,
      renderCell: (params) => {
        console.log(params);
        apiRef.current = params.api;
        return null;
      },
    },
  ];

  const renderTable = () => {
    if (data) {
      switch (data.length) {
        case 0:
          return (
            <DataGrid
              sx={{
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "green",
                },
              }}
              // loading={loading}
              getRowId={(r) => r.id}
              rows={rows}
              disableSelectionOnClick
              columns={columns}
              pageSize={8}
              data={(query) =>
                new Promise(() => {
                  console.log(query);
                })
              }
              autoHeight
              components={{
                NoRowsOverlay,
              }}
            />
          );
        default:
          if (loading) {
            return <Loading />;
          } else {
            return (
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
                getRowId={(r) => r.id}
                rows={list_products}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                data={(query) =>
                  new Promise(() => {
                    console.log(query);
                  })
                }
                components={{
                  NoRowsOverlay,
                }}
              />
            );
          }
      }
    } else {
      return (
        <DataGrid
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "green",
            },
          }}
          // loading={loading}
          getRowId={(r) => r.id}
          rows={rows}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          data={(query) =>
            new Promise(() => {
              console.log(query);
            })
          }
          autoHeight
          components={{
            NoRowsOverlay,
          }}
        />
      );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="inventory-container">
        <div className="inventory-card">
          <ArrowBackIosIcon
            className="arrow-icon"
            onClick={() => navigate(`/new-inventory-note`)}
          />
          <h1 className="inventory-card-h1">Điều chỉnh số lượng trong kho</h1>
        </div>

        <div className="account">
          <div className="accountTop">
            <div className="account-top">
              <Formik
                initialValues={{
                  product_id: "",
                  real_quantity: "",
                  product_detail_id: "",
                }}
                onReset={handleReset}
                onSubmit={onSubmit}
                validationSchema={SchemaErrorMessageCheckInventory}
                validateOnBlur
                validateOnChange
                handleReset
              >
                {(formik) => {
                  console.log(formik);
                  return (
                    <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                      <Form.Group className="top-add-product" widths="equal">
                        <Form.Select
                          fluid
                          label="Sản phẩm"
                          options={listImportPro.data || []}
                          placeholder="Sản phẩm"
                          name="product_name"
                          onChange={(e, v) => {
                            const { text, id } = listImportPro.data.find(
                              (o) => o.value === v.value
                            );
                            formik.setFieldValue("product_id", v.value);
                            formik.setFieldValue("product_detail_id", id);
                            formik.setFieldValue("product_name", text);
                          }}
                          value={formik.values.product_name}
                          error={
                            formik.touched.product_name && formik.errors.product_name
                              ? formik.errors.product_name
                              : null
                          }
                          text={formik.values.product_name}
                          disabled={data || response.data.length > 0 ? true : false}
                        />
                        <Form.Input
                          fluid
                          label="Số lượng thực tế"
                          placeholder="Số lượng thực tế"
                          type="number"
                          name="real_quantity"
                          onChange={formik.handleChange}
                          value={formik.values.real_quantity}
                          disabled={data || response.data.length > 0 ? true : false}
                          error={
                            formik.touched.real_quantity && formik.errors.real_quantity
                              ? formik.errors.real_quantity
                              : null
                          }
                        />
                        {data ? (
                          ""
                        ) : (
                          <Form.Button
                            label="."
                            className="choose-button-add-product"
                            type="submit"
                            color="green"
                          >
                            Chọn
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
                      </Form.Group>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div className="accountTopLeft">
              <Box sx={{ width: "100%" }}>
                <Stack direction="row" spacing={1}>
                  {/* <Button size="small" onClick={handleDeleteRow}>
                            Delete a row
                          </Button> */}
                </Stack>

                {response.data.length === 0 && renderTable()}
                {response.data.length > 0 && (
                  <DataGrid
                    sx={{
                      "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                        outline: "none",
                      },
                      "& .MuiDataGrid-cell:hover": {
                        color: "green",
                      },
                    }}
                    // loading={loading}
                    getRowId={(r) => r.product_detail_id}
                    rows={response.data}
                    disableSelectionOnClick
                    columns={columns_after_adjust}
                    pageSize={8}
                    data={(query) =>
                      new Promise(() => {
                        console.log(query);
                      })
                    }
                    autoHeight
                    components={{
                      NoRowsOverlay,
                    }}
                  />
                )}
              </Box>
            </div>
          </div>
          <div className="accountBottom">
            {list_products && list_products.length > 0 ? (
              <Form.Button
                type="submit"
                color="yellow"
                onClick={handleClickAdjusment}
                disabled={response.data.length > 0}
              >
                Điều chỉnh
              </Form.Button>
            ) : (
              <Form.Button type="submit" color="green" onClick={handleClickButton}>
                Kiểm tra
              </Form.Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
