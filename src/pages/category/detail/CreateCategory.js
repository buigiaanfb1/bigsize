import React from "react";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Paper, makeStyles } from "@material-ui/core";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CategoryForm from "./CategoryForm";
import PageHeader from "../../components/createForm/PageHeader";

const useStyles = makeStyles((theme) => ({
  pageContent: {
    margin: theme.spacing(5),
    padding: theme.spacing(3),
  },
}));

export default function CreateCategory() {
  const classes = useStyles();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <PageHeader
        title="Tạo thể loại mới cho sản phẩm"
        subTitle=""
        icon={<AddBusinessIcon fontSize="large" />}
      />
      <Paper className={classes.pageContent}>
        <CategoryForm />
      </Paper>
    </DashboardLayout>
  );
}
