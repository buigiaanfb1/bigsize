/* eslint-disable */
// import { useState } from "react";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";

import ConfirmDialog from "pages/components/dialog/ConfirmDialog";
import TableDialog from "./dialogTable";
import {
  viewDetailDeliveryNoteAction,
  approveDeliveryAction,
  rejectDeliveryAction,
} from "../../../../redux/actions/deliverAction";
import { triggerReload } from "../../../../redux/actions/userAction";
import Loading from "../../../../components/Loading";
import "./viewDeliveryNote.css";
import {
  APPROVE_DELIVERY_NOTE_SUCCESS,
  APPROVE_DELIVERY_NOTE_FAIL,
  REJECT_DELIVERY_NOTE_FAIL,
  REJECT_DELIVERY_NOTE_SUCCESS,
} from "../../../../service/Validations/VarConstant";

export default function DeliveryNoteForm() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", subTitle: "" });
  const [tableDialog, setTableDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
    data: [],
  });

  const { deliveryId } = useParams();
  const dispatch = useDispatch();
  const { data, loading, totalProduct } = useSelector((state) => state.viewDetailDeliveryNote);
  const approveDelivery = useSelector((state) => state.approveDeliveryState);
  const rejectDelivery = useSelector((state) => state.rejectDeliveryState);

  console.log(data);
  useEffect(() => {
    dispatch(viewDetailDeliveryNoteAction(deliveryId));
  }, [
    dispatch,
    triggerReload,
    approveDelivery.success,
    approveDelivery.error,
    rejectDelivery.success,
    rejectDelivery.error,
  ]);

  useEffect(() => {
    if (approveDelivery.success) {
      if (approveDelivery.success.is_success && !approveDelivery.success.content) {
        console.log(approveDelivery);
        toast.success("Duy???t ????n h??ng th??nh c??ng");
        dispatch({ type: APPROVE_DELIVERY_NOTE_SUCCESS, payload: false });
      } else if (approveDelivery.success.is_success && approveDelivery.success.content) {
        console.log(approveDelivery.success.content);
        setTableDialog({
          isOpen: true,
          title: "Y??u c???u nh???p h??ng kh??ng th??nh c??ng?",
          subTitle: "C?? s???n ph???m v?????t s??? l?????ng trong kho",
          data: approveDelivery.success.content,
        });
        toast.error("Duy???t th???t b???i, c?? s???n ph???m v?????t s??? l?????ng trong kho");
        dispatch({ type: APPROVE_DELIVERY_NOTE_SUCCESS, payload: false });
      }
    }
    if (approveDelivery.error) {
      toast.error("Duy???t ????n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: APPROVE_DELIVERY_NOTE_FAIL, payload: false });
    }
  }, [triggerReload, approveDelivery.success, approveDelivery.error]);

  useEffect(() => {
    if (rejectDelivery.success) {
      toast.success("T??? ch???i ????n h??ng th??nh c??ng");
      dispatch({ type: REJECT_DELIVERY_NOTE_SUCCESS, payload: false });
    }
    if (rejectDelivery.error) {
      toast.error("T??? ch???i ????n h??ng th???t b???i, vui l??ng th??? l???i");
      dispatch({ type: REJECT_DELIVERY_NOTE_FAIL, payload: false });
    }
  }, [triggerReload, rejectDelivery.success, rejectDelivery.error]);

  const handleReject = (id) => {
    dispatch(rejectDeliveryAction(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const handleAccept = (id) => {
    dispatch(approveDeliveryAction(id));
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
  };

  const columns = [
    {
      field: "product_detail_id",
      headerName: "M??",
      width: 70,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? "" : params.row.product_detail_id}
        </div>
      ),
    },
    {
      field: "product_name",
      headerName: "S???n ph???m",
      width: 550,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? (
            ""
          ) : (
            <img
              className="productListImg"
              src={params.row.image_url}
              alt={params.row.product_name}
            />
          )}
          {params.row.product_name}&emsp;&emsp;
          {params.row.category}&emsp;&emsp;
          {params.row.colour}&emsp;&emsp;
          {params.row.size}&emsp;&emsp;
        </div>
      ),
    },
    {
      field: "price",
      headerName: "????n gi??",
      width: 150,
      renderCell: (params) => <div>{params.row.price_per_one.toLocaleString("vi-VN")}</div>,
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
          {params.row.price ? (
            <div className="offlineOrderItem">{`${params.row.price.toLocaleString("vi-VN")}`}</div>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  const columnsPendingOrder = [
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
      width: 500,
      renderCell: (params) => (
        <div className="productListItem">
          {params.row.total_quantity_price ? (
            ""
          ) : (
            <img
              className="productListImg"
              src={params.row.image_url}
              alt={params.row.product_name}
            />
          )}
          {params.row.product_name}&emsp;&emsp;
          {params.row.category}&emsp;&emsp;
          {params.row.colour}&emsp;&emsp;
          {params.row.size}&emsp;&emsp;
        </div>
      ),
    },
    {
      field: "price",
      headerName: "????n gi??",
      width: 150,
      renderCell: (params) => <div>{params.row.price_per_one.toLocaleString("vi-VN")}</div>,
    },
    {
      field: "quantity",
      headerName: "S.L?????ng",
      width: 100,
    },
    {
      field: "current_quantity",
      headerName: "S.L?????ng Trong Kho",
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
          {params.row.price ? (
            <div className="offlineOrderItem">{`${params.row.price.toLocaleString("vi-VN")}`}</div>
          ) : (
            ""
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
        <div className="offlineOrderTop">
          <div className="buttonApprove">
            {data.status === "Ch??? x??c nh???n" ? (
              <Stack className="bottom-button" direction="row" spacing={2}>
                <Button
                  className="approve"
                  variant="outlined"
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      title: "B???n c?? mu???n x??c nh???n y??u c???u nh???p h??ng n??y?",
                      subTitle: "X??c nh???n",
                      onConfirm: () => {
                        handleAccept(deliveryId);
                      },
                    })
                  }
                >
                  X??c nh???n
                </Button>
                <Button
                  className="deny"
                  variant="outlined"
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      title: "B???n c?? mu???n t??? ch???i y??u c???u nh???p h??ng n??y?",
                      subTitle: "H???y",
                      onConfirm: () => {
                        handleReject(deliveryId);
                      },
                    })
                  }
                >
                  T??? ch???i
                </Button>
              </Stack>
            ) : (
              <></>
            )}
          </div>
          <Grid container>
            <Grid item xs={6}>
              <div className="container-title">
                <div className="title">T??n ????n:</div>
                <div className="content">&emsp;{data.delivery_note_name}</div>
              </div>             
              <div className="container-title">
                <div className="title">Ng?????i T???o ????n:</div>
                <div className="content">&emsp;{data.receive_staff_name}</div>
              </div>
              <div className="container-title">
                <div className="title">S??T Ng?????i t???o ????n:</div>
                <div className="content">&emsp;{data.to_store.store_phone}</div>
              </div>
              <div className="container-title">
                <div className="title">Y??u c???u t???:</div>
                <div className="content">&emsp;{data.to_store.store_name}</div>
              </div>
              <div className="container-title">
                <div className="title">?????a ch??? chi nh??nh:</div>
                <div className="content">&emsp;{data.to_store.store_address}</div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="container-title">
                <div className="title">Ng??y t???o:</div>
                <div className="content">&emsp;{data.create_date}</div>
              </div>
              <div className="container-title">
                <div className="title">Qu???n l??: </div>
                <div className="content">&emsp;{data.from_store.manager_name}</div>
              </div>
              <div className="container-title">
                <div className="title">S??T: </div>
                <div className="content"> &emsp; {data.from_store.store_phone}</div>
              </div>
              <div className="container-title">
                <div className="title">Y??u c???u ?????n: </div>
                <div className="content">&emsp;{data.from_store.store_name}</div>
              </div>
              <div className="container-title">
                <div className="title">?????a ch???: </div>
                <div className="content">&emsp; {data.from_store.store_address}</div>
              </div>
            </Grid>
          </Grid>

          <div className="offlineOrderTopLeft">
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
              loading={loading}
              rows={totalProduct}
              disableSelectionOnClick
              columns={data.status === "Ch??? x??c nh???n" ? columnsPendingOrder : columns}
              pageSize={10}
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
      <TableDialog confirmDialog={tableDialog} setConfirmDialog={setTableDialog} />
    </div>
  );
}
