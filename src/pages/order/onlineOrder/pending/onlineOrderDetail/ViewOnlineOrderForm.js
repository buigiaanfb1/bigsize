// import { useState } from "react";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Form } from "semantic-ui-react";
import { Formik } from "formik";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";

import ConfirmDialog from "pages/components/dialog/ConfirmDialog";
import TableDialog from "pages/deliveryNote/exportDelivery_admin/detail/dialogTable";
import {
  viewDetailOfflineOrderAction,
  approveOnlineOrderAction,
  cancelOnlineOrderAction,
  rejectOnlineOrderAction,
} from "../../../../../redux/actions/orderAction";
import { SchemaErrorMessageOnlineOrderAssign } from "../../../../../service/Validations/OrderAssignValidation";

import { listStaffInStoreAction } from "../../../../../redux/actions/staffAction";
import { triggerReload } from "../../../../../redux/actions/userAction";
import Loading from "../../../../../components/Loading";
import "./viewOnlineOrder.css";
import {
  APPROVE_ONLINE_ORDER_SUCCESS,
  APPROVE_ONLINE_ORDER_FAIL,
  CANCEL_ONLINE_ORDER_SUCCESS,
  CANCEL_ONLINE_ORDER_FAIL,
  REJECT_ONLINE_ORDER_FAIL,
  REJECT_ONLINE_ORDER_SUCCESS,
} from "../../../../../service/Validations/VarConstant";

export default function OfflineOrderForm() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  const [tableDialog, setTableDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    data: [],
  });
  const { onlineOrderId } = useParams();
  const dispatch = useDispatch();
  const { data, loading, totalProduct } = useSelector((state) => state.viewDetailOnlineOrder);
  const approveOnOrder = useSelector((state) => state.approveOnlineOrder);
  const rejectOnOrder = useSelector((state) => state.rejectOnlineOrder);
  const cancelOnOrder = useSelector((state) => state.cancelOnlineOrder);
  const staffDropdown = useSelector((state) => state.getListStaffDropDown);
  const {
    product_list,
    store,
    order_id,
    create_date,
    status,
    payment_method,
    customer_name,
    delivery_address,
  } = data;
  console.log(data);
  console.log(product_list);

  useEffect(() => {
    dispatch(viewDetailOfflineOrderAction(onlineOrderId, "online"));
    dispatch(listStaffInStoreAction());
  }, [
    dispatch,
    triggerReload,
    approveOnOrder.success,
    approveOnOrder.error,
    rejectOnOrder.success,
    rejectOnOrder.error,
    cancelOnOrder.success,
    cancelOnOrder.error,
  ]);

  useEffect(() => {
    if (approveOnOrder.success) {
      if (approveOnOrder.success.is_success && !approveOnOrder.success.content) {
        toast.success("Duy???t ????n h??ng th??nh c??ng");
        dispatch({ type: APPROVE_ONLINE_ORDER_SUCCESS, payload: false });
      } else if (approveOnOrder.success.is_success && approveOnOrder.success.content) {
        setTableDialog({
          isOpen: true,
          title: "Y??u c???u nh???p h??ng kh??ng th??nh c??ng?",
          subTitle: "C?? s???n ph???m v?????t s??? l?????ng trong kho",
          data: approveOnOrder.success.content,
        });
        toast.error("Duy???t th???t b???i, c?? s???n ph???m v?????t s??? l?????ng trong kho");
        dispatch({ type: APPROVE_ONLINE_ORDER_SUCCESS, payload: false });
      }
    }
    if (approveOnOrder.error) {
      toast.error("Duy???t ????n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: APPROVE_ONLINE_ORDER_FAIL, payload: false });
    }
  }, [triggerReload, approveOnOrder.success, approveOnOrder.error]);

  useEffect(() => {
    if (rejectOnOrder.success) {
      toast.success("T??? ch???i ????n h??ng th??nh c??ng");
      dispatch({ type: REJECT_ONLINE_ORDER_SUCCESS, payload: false });
    }
    if (rejectOnOrder.error) {
      toast.error("T??? ch???i ????n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: REJECT_ONLINE_ORDER_FAIL, payload: false });
    }
  }, [triggerReload, rejectOnOrder.success, rejectOnOrder.error]);

  useEffect(() => {
    if (cancelOnOrder.success) {
      toast.success("H???y th??nh c??ng, ????n h??ng quay l???i ch??? x??c nh???n");
      dispatch({ type: CANCEL_ONLINE_ORDER_SUCCESS, payload: false });
    }
    if (
      typeof cancelOnOrder.error === "string" &&
      cancelOnOrder.error.includes("Kh??ng th??? h???y ????n h??ng")
    ) {
      toast.error("????n h??ng ???? ????ng g??i ho???c ??ang giao, kh??ng th??? h???y");
      dispatch({ type: CANCEL_ONLINE_ORDER_FAIL, payload: false });
    } else if (cancelOnOrder.error) {
      toast.error("H???y ????n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: CANCEL_ONLINE_ORDER_FAIL, payload: false });
    }
  }, [triggerReload, cancelOnOrder.success, cancelOnOrder.error]);

  const onSubmit = (result) => {
    dispatch(approveOnlineOrderAction(order_id, result));
  };

  const handleReject = (id) => {
    dispatch(rejectOnlineOrderAction(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const handleCancel = (id) => {
    dispatch(cancelOnlineOrderAction(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const columns = [
    {
      field: "product_detail_id",
      headerName: "M??",
      width: 50,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? "" : params.row.product_detail_id}
        </div>
      ),
    },
    {
      field: "product_name",
      headerName: "S???n ph???m",
      width: 350,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? (
            ""
          ) : (
            <img
              className="productListImg"
              src={params.row.product_image_url}
              alt={params.row.product_name}
            />
          )}
          {params.row.product_name}&emsp;
          {params.row.category}&emsp;
          {params.row.colour}&emsp;
          {params.row.size}
        </div>
      ),
    },
    {
      field: "price",
      headerName: "????n gi??",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.discount_price_per_one ? (
            <div>
              <del>{params.row.price_per_one.toLocaleString("vi-VN")}</del>&emsp;
              {params.row.discount_price_per_one.toLocaleString("vi-VN")}
            </div>
          ) : (
            <div>{params.row.price_per_one.toLocaleString("vi-VN")}</div>
          )}
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "S??? l?????ng",
      width: 150,
    },
    {
      field: "total_quantity_price",
      headerName: "Th??nh Ti???n",
      width: 100,
      renderCell: (params) => (
        <div>
          {params.row.total_quantity_price ? (
            <b>{params.row.total_quantity_price.toLocaleString("vi-VN")}</b>
          ) : (
            ""
          )}
          {params.row.discount_price ? (
            <div className="onlineOrderItem">{`${params.row.discount_price.toLocaleString(
              "vi-VN"
            )}`}</div>
          ) : (
            <div className="onlineOrderItem">{`${params.row.price.toLocaleString("vi-VN")}`}</div>
          )}
        </div>
      ),
    },
  ];

  const columnStatusPending = [
    {
      field: "product_detail_id",
      headerName: "M??",
      width: 50,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? "" : params.row.product_detail_id}
        </div>
      ),
    },
    {
      field: "product_name",
      headerName: "S???n ph???m",
      width: 390,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? (
            ""
          ) : (
            <img
              className="productListImg"
              src={params.row.product_image_url}
              alt={params.row.product_name}
            />
          )}
          {params.row.product_name}&emsp;
          {params.row.category}&emsp;
          {params.row.colour}&emsp;
          {params.row.size}
        </div>
      ),
    },
    {
      field: "price",
      headerName: "????n gi??",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.discount_price_per_one ? (
            <div>
              <del>{params.row.price_per_one.toLocaleString("vi-VN")}</del>&emsp;
              {params.row.discount_price_per_one.toLocaleString("vi-VN")}
            </div>
          ) : (
            <div>{params.row.price_per_one.toLocaleString("vi-VN")}</div>
          )}
        </div>
      ),
    },
    {
      field: "quantity",
      headerName: "S??? l?????ng",
      width: 80,
    },
    {
      field: "current_quantity_in_store",
      headerName: "S.L?????ng trong c???a h??ng",
      width: 180,
      renderCell: (params) => (
        <div
          style={{ color: params.row.current_quantity_in_store < params.row.quantity ? "red" : "" }}
        >
          {params.row.current_quantity_in_store}
        </div>
      ),
    },
    {
      field: "total_quantity_price",
      headerName: "Th??nh Ti???n",
      width: 100,
      renderCell: (params) => (
        <div>
          {params.row.total_quantity_price ? (
            <b>{params.row.total_quantity_price.toLocaleString("vi-VN")}</b>
          ) : (
            ""
          )}
          {params.row.discount_price ? (
            <div className="onlineOrderItem">{`${params.row.discount_price.toLocaleString(
              "vi-VN"
            )}`}</div>
          ) : (
            <div className="onlineOrderItem">{`${params.row.price.toLocaleString("vi-VN")}`}</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="onlineOrderTop">
          <Formik
            initialValues={{
              staff: "",
            }}
            onSubmit={onSubmit}
            validationSchema={SchemaErrorMessageOnlineOrderAssign}
            validateOnBlur
            validateOnChange
          >
            {(formik) => {
              console.log(formik);
              return (
                <div>
                  <Form onSubmit={formik.handleSubmit}>
                    <div className="buttonApprove">
                      {status === "Ch??? x??c nh???n" ? (
                        <Stack className="bottom-button" direction="row" spacing={2}>
                          <Button
                            className="approve"
                            variant="outlined"
                            type="submit"
                            disabled={formik.isSubmitting}
                          >
                            X??c nh???n
                          </Button>
                          <Button
                            className="deny"
                            variant="outlined"
                            disabled={formik.isSubmitting}
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                title: "B???n c?? mu???n t??? ch???i ????n h??ng n??y?",
                                subTitle: "X??c nh???n",
                                onConfirm: () => {
                                  handleReject(order_id);
                                },
                              })
                            }
                          >
                            T??? ch???i
                          </Button>
                        </Stack>
                      ) : (
                        <div />
                      )}
                      {status === "???? x??c nh???n" ? (
                        <Stack className="bottom-button" direction="row" spacing={2}>
                          <Button
                            className="deny"
                            variant="outlined"
                            disabled={formik.isSubmitting}
                            onClick={() =>
                              setConfirmDialog({
                                isOpen: true,
                                title: "B???n c?? mu???n h???y ????n h??ng n??y?",
                                subTitle: "????n h??ng quay l???i ch??? x??c nh???n",
                                onConfirm: () => {
                                  handleCancel(order_id);
                                },
                              })
                            }
                          >
                            H???y
                          </Button>
                        </Stack>
                      ) : (
                        <div />
                      )}
                    </div>
                    <Grid container>
                      <Grid item xs={4}>
                        <div className="container-title">
                          <div className="title">Ng??y b??n:</div>
                          <div className="content">&emsp;{create_date}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">H??a ????n:</div>
                          <div className="content">&emsp;{order_id}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">T??n KH:</div>
                          <div className="content">&emsp;{customer_name}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">Ph????ng th???c thanh to??n:</div>
                          <div className="content">&emsp;{payment_method}</div>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        <div className="container-title">
                          <div className="title">C???a h??ng:</div>
                          <div className="content">
                            &emsp;{store.store_name} &emsp; - &emsp; {store.store_phone}
                          </div>
                        </div>
                        {/* <div className="container-title">
                          <div className="title">S??T c???a h??ng:</div>
                          <div className="content"></div>
                        </div> */}

                        <div className="container-title">
                          <div className="title">Nh??n vi??n chu???n b??? ????n h??ng:&emsp;</div>
                          <div className="content">
                            {staffDropdown.loading ? (
                              <Loading />
                            ) : (
                              <div>
                                {data.status !== "Ch??? x??c nh???n" ? (
                                  <Form.Select
                                    fluid
                                    // options={staffDropdown.data || []}
                                    placeholder="Nh??n vi??n"
                                    onChange={(e, v) => {
                                      formik.setFieldValue("staff", v.value);
                                    }}
                                    name="staff"
                                    value={formik.values.staff}
                                    error={formik.errors.staff}
                                    text={data.staff_name}
                                    // disabled
                                  />
                                ) : (
                                  <Form.Select
                                    search
                                    fluid
                                    options={staffDropdown.data || []}
                                    placeholder="Nh??n vi??n"
                                    onChange={(e, v) => {
                                      formik.setFieldValue("staff", v.value);
                                    }}
                                    name="staff"
                                    value={formik.values.staff}
                                    error={formik.errors.staff}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="container-address">
                          <div className="title-address">?????a ch??? c???a h??ng:</div>
                          <div className="content-address">&emsp;{store.store_address}</div>
                        </div>
                        <div className="container-title">
                          <div className="title">?????a ch??? giao h??ng:</div>
                          <div className="content">&emsp;{delivery_address.receive_address}</div>
                        </div>
                      </Grid>
                    </Grid>
                  </Form>
                </div>
              );
            }}
          </Formik>
          <div className="onlineOrderTopLeft">
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
              hideFooter
              loading={loading}
              rows={totalProduct}
              disableSelectionOnClick
              columns={status === "Ch??? x??c nh???n" ? columnStatusPending : columns}
              pageSize={8}
              rowsPerPageOptions={[]}
              data={(query) =>
                new Promise(() => {
                  console.log(query);
                })
              }
            />
          </div>
        </div>
      )}
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      <TableDialog
        confirmDialog={tableDialog}
        setConfirmDialog={setTableDialog}
        isAddProduct="true"
      />
    </div>
  );
}
