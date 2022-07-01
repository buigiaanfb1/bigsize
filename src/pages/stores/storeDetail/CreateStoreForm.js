import { Grid, makeStyles } from "@material-ui/core";
// import { useState } from "react";
import { Formik, Form } from "formik";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Controls from "../../components/createForm/controls/Controls";
// import { Form } from "./useForm";
import { viewDetail } from "../../../redux/actions/storeAction";

import { SchemaErrorMessageCreateStore } from "../../../service/Validations/StoreValidation";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: theme.spacing(1),
    },
  },
}));

export default function StoreForm() {
  const { storeId } = useParams();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.viewStore);
  const triggerReload = useSelector((state) => state.triggerReload);

  console.log(data);
  const classes = useStyles();

  useEffect(() => {
    dispatch(viewDetail(storeId));
  }, [dispatch, triggerReload]);

  // const handleReset = () => {};

  // const handleSubmit = (data) => {
  //   dispatch(createStore(data));
  // };

  return (
    <Formik
      initialValues={{
        storeAddress: data.store_address,
        phone: data.store_phone,
      }}
      validationSchema={SchemaErrorMessageCreateStore}
      validateOnBlur
      validateOnChange
      // onSubmit={handleSubmit}
      // onReset={handleReset}
    >
      {(props) => (
        <Form className={classes.root}>
          <Grid container>
            <Grid item xs={6}>
              <Controls.Input
                name="storeAddress"
                label="Địa chỉ cửa hàng"
                value={props.values.storeAddress}
                onChange={props.handleChange}
                disable
                fullWidth
                multiline
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {console.log(props)}
            <Grid item xs={6}>
              <Controls.Input
                name="phone"
                label="Số điện thoại"
                value={props.values.phone}
                onChange={props.handleChange}
                disable
              />
              {/* <div>
                <Controls.Button
                  type="submit"
                  text="Submit"
                  disabled={props.errors && props.isSubmitting}
                />
              </div> */}
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
