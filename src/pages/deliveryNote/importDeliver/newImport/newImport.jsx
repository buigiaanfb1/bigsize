/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import "./newImport.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Label } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import {
  CREATE_IMPORT_PRODUCT_LIST_FAIL,
  CREATE_IMPORT_PRODUCT_LIST_SUCCESS,
  ACTIVE_STORE_LIST_DROPDOWN_SUCCESS,
  ACTIVE_STORE_LIST_DROPDOWN_FAIL,
  DELIVERY_CART,
  USER_TOKEN,
} from "../../../../service/Validations/VarConstant";
import { DataGrid } from "@mui/x-data-grid";
import { Formik } from "formik";
import { getProductToImportAction } from "../../../../redux/actions/productAction";
import {
  deliveryImportToMainWareHouseAction,
  addToDeliverNoteAction,
  removeProductFromDeliverNoteAction,
} from "../../../../redux/actions/deliverAction";
import { SchemaErrorMessageImportInvoice } from "../../../../service/Validations/ImportInvoiceValidation";
import { triggerReload } from "../../../../redux/actions/userAction";
import { listActiveStore, getMainWareHouseAction } from "../../../../redux/actions/storeAction";
import Loading from "../../../../components/Loading";

let idCounter = 0;
const createRow = ({ product_id, product_name, quantity, product_detail_id }) => {
  idCounter += 1;
  return {
    id: idCounter,
    product_name: product_name,
    quantity: quantity,
    product_id: product_id,
    product_detail_id,
  };
};

export default function CreateImportDeliver() {
  const dispatch = useDispatch();
  const listImportPro = useSelector((state) => state.listImportProduct);
  const response = useSelector((state) => state.createImportDeliver);
  const activeStore = useSelector((state) => state.listActiveStoreDropdown);
  const { deliveryNote } = useSelector((state) => state.deliveryCart);

  const { store, loading } = activeStore;
  const mainWareHouse = useSelector((state) => state.getMainWareHouse);
  const { userToken } = useSelector((state) => state.userToken);
  const [rows, setRows] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [deliveryName, setDeliverName] = useState("");
  const [storeId, setStoreID] = useState("");
  const apiRef = useRef(null);

  console.log(activeStore);
  // const { apiRef, columns } = useApiRef();

  console.log(mainWareHouse);
  console.log(deliveryNote);
  // console.log(listImportPro);
  const { success, error } = response;

  useEffect(() => {
    dispatch(getProductToImportAction());
    dispatch(getMainWareHouseAction());
    dispatch({ type: ACTIVE_STORE_LIST_DROPDOWN_SUCCESS, payload: "" });
    if (userToken) {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        const { token } = currentUser;
        if (userToken !== token) {
          dispatch({ type: DELIVERY_CART, payload: "" });
        }
      }
    }
  }, [dispatch, triggerReload]);

  useEffect(() => {
    if (typeof error === "string" && error.includes("Tr??ng s???n ph???m")) {
      toast.error("Th??m th???t b???i, vui l??ng kh??ng ch???n s???n ph???m tr??ng");
      dispatch({ type: CREATE_IMPORT_PRODUCT_LIST_FAIL, payload: false });
    } else if (error) {
      toast.error("Th??m th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: CREATE_IMPORT_PRODUCT_LIST_FAIL, payload: false });
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (typeof activeStore.error === "string" && activeStore.error.includes("Tr??ng s???n ph???m")) {
      toast.error("Ki???m tra c???a h??ng c??n h??ng th???t b???i, vui l??ng kh??ng ch???n s???n ph???m tr??ng");
      dispatch({ type: ACTIVE_STORE_LIST_DROPDOWN_FAIL, payload: false });
    } else if (activeStore.error) {
      toast.error("Ki???m tra c???a h??ng c??n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: ACTIVE_STORE_LIST_DROPDOWN_FAIL, payload: false });
    }
  }, [activeStore.error, triggerReload, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("T???o ????n nh???p h??ng th??nh c??ng");
      setSubmit(true);
      dispatch({ type: CREATE_IMPORT_PRODUCT_LIST_SUCCESS, payload: false });
    }
  }, [success, triggerReload, dispatch]);

  //

  const onSubmit = (data) => {
    if (deliveryNote.length > 0) {
      dispatch(addToDeliverNoteAction(deliveryNote, data));
    } else {
      setRows((prevRows) => [...prevRows, createRow(data)]);
    }

    setDeliverName(data.delivery_note_name);
    setStoreID(data.store_id);
    console.log(rows);
  };

  const handleReset = () => {
    setSubmit(false);
    if (store) {
      dispatch({ type: ACTIVE_STORE_LIST_DROPDOWN_SUCCESS, payload: "" });
    }
    if (rows) {
      setRows([]);
    }
    setRows([]);
    dispatch({ type: DELIVERY_CART, payload: [] });
  };

  const handleClickButton = () => {
    if (apiRef.current) {
      const data = apiRef.current.getRowModels();
      if (data.size > 0) {
        console.log(data);
        dispatch(deliveryImportToMainWareHouseAction(data, deliveryName, storeId));
      } else {
        toast.error("B???n ch??a th??m s???n ph???m n??o ????n nh???p h??ng, Vui l??ng th??? l???i");
      }
    } else {
      toast.error("B???n ch??a th??m s???n ph???m n??o ????n nh???p h??ng, Vui l??ng th??? l???i");
    }
  };

  const handleCheckingButton = () => {
    if (apiRef.current) {
      const data = apiRef.current.getRowModels();
      if (data.size > 0) {
        console.log(data);
        dispatch(listActiveStore(data));
      } else {
        toast.error("B???n ch??a th??m s???n ph???m n??o ????n nh???p h??ng, Vui l??ng th??? l???i");
      }
    } else {
      toast.error("B???n ch??a th??m s???n ph???m n??o ????n nh???p h??ng, Vui l??ng th??? l???i");
    }
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Ch??a c?? s???n ph???m n??o
      </Stack>
    );
  }

  const columns = [
    {
      field: "product_name",
      headerName: "S???n ph???m",
      flex: 1.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
    },
    {
      field: "quantity",
      headerName: "S??? l?????ng",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "action",
      headerName: "Thao t??c",
      flex: 0.2,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div>
          {store && store.length !== 0 ? (
            ""
          ) : (
            <button
              onClick={() => {
                if (deliveryNote.length > 0) {
                  dispatch(removeProductFromDeliverNoteAction(deliveryNote, params.row.id));
                } else {
                  setRows(rows.filter((e) => e.id !== params.row.id));
                }
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
      <div className="newImport">
        <h1 className="createImportTitle">T???o ????n nh???p h??ng</h1>
        <div className="account">
          <div className="accountTop">
            <div className="account-top">
              {mainWareHouse.loading ? (
                <Loading />
              ) : (
                <Formik
                  initialValues={{
                    product_name: "",
                    product_id: "",
                    quantity: "",
                    delivery_note_name: "",
                    store_id: mainWareHouse.store[0].store_id,
                    store_name: mainWareHouse.store[0].store_name,
                    product_detail_id: "",
                  }}
                  onSubmit={onSubmit}
                  validationSchema={SchemaErrorMessageImportInvoice}
                  validateOnBlur
                  validateOnChange
                  onReset={handleReset}
                >
                  {(formik) => {
                    console.log(formik);
                    return (
                      <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                        <Form.Group className="top-add-product" widths="equal">
                          <Form.Input
                            label="T??n ????n ?????t h??ng"
                            placeholder="T??n ????n ?????t h??ng"
                            type="text"
                            name="delivery_note_name"
                            onChange={(e, v) => {
                              setDeliverName(v.value);
                              setStoreID(mainWareHouse.store[0].store_id);
                              formik.handleChange(e);
                            }}
                            value={formik.values.delivery_note_name}
                            error={
                              formik.touched.delivery_note_name && formik.errors.delivery_note_name
                                ? formik.errors.delivery_note_name
                                : null
                            }
                            disabled={submit}
                          />
                        </Form.Group>

                        <Form.Group className="top-add-product" widths="4">
                          <Form.Select
                            search
                            fluid
                            label="S???n ph???m"
                            options={listImportPro.data || []}
                            placeholder="S???n ph???m"
                            name="product_name"
                            onChange={(e, v) => {
                              const { text, id } = listImportPro.data.find(
                                (o) => o.value === v.value
                              );
                              formik.setFieldValue("product_id", v.value);
                              formik.setFieldValue("product_name", text);
                              formik.setFieldValue("product_detail_id", id);
                            }}
                            value={formik.values.product_name}
                            error={
                              formik.touched.product_name && formik.errors.product_name
                                ? formik.errors.product_name
                                : null
                            }
                            text={formik.values.product_name}
                            disabled={submit}
                            readOnly
                          />
                          <Form.Input
                            fluid
                            label="S??? l?????ng"
                            placeholder="S??? l?????ng"
                            type="number"
                            name="quantity"
                            onChange={formik.handleChange}
                            value={formik.values.quantity}
                            error={
                              formik.touched.quantity && formik.errors.quantity
                                ? formik.errors.quantity
                                : null
                            }
                            disabled={submit}
                            readOnly={store && store.length > 0 ? true : false}
                          />

                          {store && store.length > 0 ? (
                            ""
                          ) : (
                            <Form.Button
                              className="button-add-product"
                              label="??"
                              type="submit"
                              color="green"
                            >
                              Th??m s???n ph???m v??o ????n nh???p h??ng
                            </Form.Button>
                          )}

                          <Form.Button
                            label="."
                            className="button-add-product"
                            type="reset"
                            color="blue"
                          >
                            L??m m???i
                          </Form.Button>
                        </Form.Group>

                        <Form.Group className="top-add-product" widths="equal">
                          {store && store.length > 0 ? (
                            <Form.Select
                              label="Nh???p h??ng t??? (c???a h??ng c??n h??ng)"
                              options={activeStore.store || []}
                              placeholder="T??? c???a h??ng"
                              name="store_name"
                              onChange={(e, v) => {
                                const { text, value } = activeStore.store.find(
                                  (o) => o.value === v.value
                                );
                                formik.setFieldValue("store_id", v.value);
                                formik.setFieldValue("store_name", text);
                                setStoreID(value);
                              }}
                              value={formik.values.store_id}
                              // error={formik.errors.product_name}
                              text={formik.values.store_name}
                              disabled={submit}
                            />
                          ) : (
                            ""
                          )}
                        </Form.Group>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </div>
            <div className="accountTopLeft">
              <Box sx={{ width: "100%" }}>
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
                  rows={deliveryNote.length > 0 ? deliveryNote : rows}
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
              </Box>
            </div>
          </div>
          <div className="accountBottom">
            {store && store.length > 0 ? (
              <Form.Button
                type="submit"
                color="green"
                onClick={handleClickButton}
                disabled={submit}
              >
                X??c nh???n
              </Form.Button>
            ) : (
              <div>
                {loading ? (
                  <Loading />
                ) : (
                  <Form.Button
                    type="submit"
                    color="blue"
                    onClick={handleCheckingButton}
                    disabled={submit}
                  >
                    Ki???m tra c???a h??ng c??n h??ng
                  </Form.Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
