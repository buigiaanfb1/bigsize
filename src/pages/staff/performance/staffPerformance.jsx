/* eslint-disable */
import { useDispatch, useSelector } from "react-redux";
import "./staffPerformance.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Form, Label } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import {
  QUANTITY_ADJUSTMENT_INVENTORY_SUCCESS,
  QUANTITY_ADJUSTMENT_INVENTORY_FAIL,
  GET_INVENTORY_PRODUCT_LIST_FAIL,
  GET_INVENTORY_PRODUCT_LIST_SUCCESS,
} from "../../../service/Validations/VarConstant";
import { SchemaErrorMessageStaffPerformance } from "../../../service/Validations/StaffPerformanceValidation";
import { DataGrid } from "@mui/x-data-grid";
import { Formik } from "formik";
import { staffPerformanceAction } from "../../../redux/actions/orderAction";
import Loading from "../../../components/Loading";
let idCounter = 0;

const formatDate = (date) => {
  const arrayDate = date.split("-");
  const newDate = `${arrayDate[2]}/${arrayDate[1]}/${arrayDate[0]}`;
  return newDate;
};

function generateArrayOfYears() {
  const max = 2100;
  const min = 2000;
  const year = [];
  for (let i = min; i <= max; i += 1) {
    const element = { key: i, text: i, value: i };
    year.push(element);
  }
  return year;
}

function generateArrayOfMonths() {
  const max = 12;
  const min = 1;
  const month = [];
  for (let i = min; i <= max; i += 1) {
    const element = { key: i, text: i, value: i };
    month.push(element);
  }
  return month;
}
const currentTime = new Date();

const currentMonth = currentTime.getMonth() + 1;
const currentYear = currentTime.getFullYear();

export default function CreateImportDeliver() {
  const dispatch = useDispatch();
  const orderStaffPerformance = useSelector((state) => state.orderStaffPerformance);
  const response = useSelector((state) => state.quantityAjustment);

  console.log(orderStaffPerformance);

  useEffect(() => {
    dispatch(staffPerformanceAction({ month: currentMonth, year: currentYear }));
  }, [dispatch]);

  // useEffect(() => {
  //   if (response.success) {
  //     toast.success("??i???u ch???nh s??? l?????ng trong kho th??nh c??ng");
  //     dispatch({ type: QUANTITY_ADJUSTMENT_INVENTORY_SUCCESS, payload: false });
  //     if (apiRef.current) {
  //       const data = apiRef.current.getRowModels();
  //       dispatch(getInventoryAction(data, fromDate, toDate));
  //     }
  //   }
  //   if (response.error) {
  //     toast.error("??i???u ch???nh s??? l?????ng trong kho th???t b???i, vui l??ng th??? l???i");
  //     dispatch({ type: QUANTITY_ADJUSTMENT_INVENTORY_FAIL, payload: false });
  //   }
  // }, [response.success, response.error, dispatch]);

  //

  const onSubmit = (data) => {
    dispatch(staffPerformanceAction(data));
  };

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Kh??ng c?? nh??n vi??n n??o
      </Stack>
    );
  }

  const columns = [
    {
      field: "uid",
      headerName: "ID",
      flex: 0.2,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      type: "singleSelect",
    },
    {
      field: "fullname",
      headerName: "T??n nh??n vi??n",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "quantity_of_orders",
      headerName: "S??? ????n ???? x??? l??",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "revenue",
      headerName: "T???ng gi?? tr??? c??c ????n h??ng ???? x??? l??",
      flex: 0.5,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          {params.row.revenue
            ? `${params.row.revenue.toLocaleString("vi-VN")}`
            : "Ch??a x??? l?? ????n h??ng n??o"}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="staffPerformance">
        <h1 className="staffPerformanceTitle">Hi???u su???t nh??n vi??n</h1>
        <div className="account">
          <div className="accountTop">
            <div className="account-top">
              <Formik
                initialValues={{
                  month: currentMonth,
                  year: currentYear,
                }}
                onSubmit={onSubmit}
                validationSchema={SchemaErrorMessageStaffPerformance}
                validateOnBlur
                validateOnChange
                handleReset
              >
                {(formik) => {
                  console.log(formik);
                  return (
                    <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                      <Form.Group className="top-add-product" widths="3">
                        <Form.Select
                          // key={store.value}
                          // fluid
                          label="Th??ng"
                          options={generateArrayOfMonths()}
                          placeholder="Ch???n th??ng"
                          onChange={(e, v) => {
                            formik.setFieldValue("month", v.value);
                          }}
                          name="month"
                          value={formik.values.month}
                          error={formik.errors.month}
                        />
                        <Form.Select
                          // key={store.value}
                          // fluid
                          label="N??m"
                          options={generateArrayOfYears()}
                          placeholder="Ch???n n??m"
                          onChange={(e, v) => {
                            formik.setFieldValue("year", v.value);
                          }}
                          name="year"
                          value={formik.values.year}
                          error={formik.errors.year}
                        />
                        <Form.Button
                          label="."
                          className="choose-button-add-product"
                          type="submit"
                          color="green"
                        >
                          Xem
                        </Form.Button>
                      </Form.Group>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            <div className="accountTopLeft">
              <Box sx={{ width: "100%" }}>
                {orderStaffPerformance.loading ? (
                  <Loading />
                ) : (
                  <DataGrid
                    sx={{
                      "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                        outline: "none",
                      },
                      "& .MuiDataGrid-cell:hover": {
                        color: "green",
                      },
                    }}
                    loading={orderStaffPerformance.loading}
                    getRowId={(r) => r.uid}
                    rows={orderStaffPerformance.data.content}
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
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
