import React from "react";
import { Paper, makeStyles } from "@material-ui/core";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ExportDeliveryNoteAdminForm from "./ViewDeliveryNoteAdminForm";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(3),
    padding: theme.spacing(1),
  },
}));

export default function DeliveryNoteDetail() {
  // const { loading } = useSelector((state) => state.viewStore);

  const classes = useStyles();
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Paper className={classes.pageContent}>
        <ExportDeliveryNoteAdminForm />
      </Paper>
    </DashboardLayout>
  );
}
