import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "@client/redux";
import { APP_PAGE, APP_STATUS, initialApp } from "@client/features/app";

const appSlice = createSlice({
  name: "APP",
  initialState: initialApp,
  reducers: {
    UPDATE_DEBUG_MODE: (state, action) => {
      state.debugMode = action.payload;
    },
    UPDATE_STATUS: (state, action) => {
      state.status = action.payload;
    },
    UPDATE_PAGE: (state, action) => {
      state.page = action.payload;
    },
    ERROR: (state, action) => {
      state.error = action.payload;
      state.status = APP_STATUS.ERROR;
    },
  },
});

const appThunks = {
  transitionOutPage:
    (callback: () => void): AppThunk =>
    async (dispatch, getState) => {
      dispatch(appFacade.action.UPDATE_STATUS(APP_STATUS.EXITING));
      window.setTimeout(() => {
        dispatch(appFacade.action.UPDATE_PAGE(APP_PAGE.NONE));
        dispatch(appFacade.action.UPDATE_STATUS(APP_STATUS.LOADING));
        callback();
      }, 500);
    },

  transitionInPage:
    (newPage: APP_PAGE, callback?: () => void): AppThunk =>
    (dispatch, getState) => {
      dispatch(appFacade.action.UPDATE_STATUS(APP_STATUS.ENTERING));
      dispatch(appFacade.action.UPDATE_PAGE(newPage));
      window.setTimeout(() => {
        dispatch(appFacade.action.UPDATE_STATUS(APP_STATUS.ACTIVE));
        if (typeof callback === "function") {
          callback();
        }
      }, 500);
    },

  transitionPage:
    (newPage: APP_PAGE): AppThunk =>
    (dispatch, getState) => {
      dispatch(appFacade.thunk.transitionOutPage(() => dispatch(appFacade.thunk.transitionInPage(newPage))));
    },

  handleError:
    (error: string): AppThunk =>
    (dispatch, getState) => {
      console.error(error);
      dispatch(appFacade.action.ERROR(error));
    },
};

export const appFacade = {
  action: appSlice.actions,
  selector: (state: RootState) => state.app,
  thunk: appThunks,
};

export const appReducer = appSlice.reducer;
