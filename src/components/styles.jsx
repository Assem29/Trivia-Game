import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  correctMessage: {
    color: "green",
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  snackbar: {
    backgroundColor: theme.palette.success.main,
  },
  snackbarMessage: {
    display: "flex",
    alignItems: "center",
  },
  checkmark: {
    marginRight: theme.spacing(1),
  },
}));
