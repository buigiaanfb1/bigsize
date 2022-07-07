import React from "react";
import StoreIcon from "@mui/icons-material/Store";
import { Paper, makeStyles } from "@material-ui/core";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import OfflineOrderForm from "./ViewOnlineOrderForm";
import PageHeader from "../../components/createForm/PageHeader";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function OnlineOrderDetail() {
  const classes = useStyles();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageHeader
        title="Thông tin hóa đơn"
        subTitle="Thông tin"
        icon={<StoreIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <OfflineOrderForm />
      </Paper>
    </DashboardLayout>
  );
}
